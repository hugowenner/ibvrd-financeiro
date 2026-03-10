<?php
// backend/api/dashboard.php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Tratamento CORS e Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Middleware Auth
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token ausente']);
    exit;
}

try {
    // Valida Token
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $currentUser = $stmt->fetch();

    if (!$currentUser) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido']);
        exit;
    }

    $user_id = $currentUser['id'];

    // Lógica de Período
    $dataInicio = $_GET['start'] ?? null;
    $dataFim = $_GET['end'] ?? null;

    $wherePeriodo = "";
    $params = [':uid' => $user_id];

    if ($dataInicio && $dataFim) {
        $wherePeriodo = " AND data BETWEEN :start AND :end";
        $params[':start'] = $dataInicio;
        $params[':end'] = $dataFim;
    }

    // Normalização defensiva do tipo no SQL:
    // aceita Entrada, entrada, Entradas, Saída, Saida, Saídas, saidas
    $sqlResumo = "SELECT 
                    COALESCE(SUM(
                        CASE
                            WHEN LOWER(REPLACE(REPLACE(TRIM(tipo), 'í', 'i'), 'Í', 'I')) IN ('entrada', 'entradas')
                            THEN valor
                            ELSE 0
                        END
                    ), 0) AS total_entradas,

                    COALESCE(SUM(
                        CASE
                            WHEN LOWER(REPLACE(REPLACE(TRIM(tipo), 'í', 'i'), 'Í', 'I')) IN ('saida', 'saidas')
                            THEN valor
                            ELSE 0
                        END
                    ), 0) AS total_saidas,

                    COUNT(
                        CASE
                            WHEN LOWER(REPLACE(REPLACE(TRIM(tipo), 'í', 'i'), 'Í', 'I')) IN ('entrada', 'entradas')
                            THEN 1
                        END
                    ) AS qtd_entradas,

                    COUNT(
                        CASE
                            WHEN LOWER(REPLACE(REPLACE(TRIM(tipo), 'í', 'i'), 'Í', 'I')) IN ('saida', 'saidas')
                            THEN 1
                        END
                    ) AS qtd_saidas

                  FROM lancamentos
                  WHERE user_id = :uid {$wherePeriodo}";

    $stmtResumo = $pdo->prepare($sqlResumo);
    $stmtResumo->execute($params);
    $resumo = $stmtResumo->fetch();

    $totalEntradas = (float) ($resumo['total_entradas'] ?? 0);
    $totalSaidas = (float) ($resumo['total_saidas'] ?? 0);
    $saldoAtual = $totalEntradas - $totalSaidas;

    // Detalhamento por Categoria
    $sqlCategorias = "SELECT categoria, SUM(valor) AS total
                      FROM lancamentos
                      WHERE user_id = :uid {$wherePeriodo}
                      GROUP BY categoria
                      ORDER BY total DESC";

    $stmtCat = $pdo->prepare($sqlCategorias);
    $stmtCat->execute($params);
    $categorias = $stmtCat->fetchAll();

    foreach ($categorias as &$cat) {
        $cat['total'] = (float) $cat['total'];
    }
    unset($cat);

    echo json_encode([
        'success' => true,
        'data' => [
            'total_entradas' => $totalEntradas,
            'total_saidas' => $totalSaidas,
            'saldo_atual' => $saldoAtual,
            'qtd_entradas' => (int) ($resumo['qtd_entradas'] ?? 0),
            'qtd_saidas' => (int) ($resumo['qtd_saidas'] ?? 0),
            'categorias' => $categorias
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}