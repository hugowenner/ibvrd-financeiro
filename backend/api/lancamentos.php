<?php
// backend/api/lancamentos.php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Tratamento rápido para o preflight do CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

function normalize_tipo($tipo) {
    $tipo = trim((string) $tipo);

    if ($tipo === '') {
        return 'Entrada';
    }

    if (function_exists('mb_strtolower')) {
        $tipoLower = mb_strtolower($tipo, 'UTF-8');
    } else {
        $tipoLower = strtolower($tipo);
    }

    $tipoLower = str_replace(['í', 'Í'], ['i', 'i'], $tipoLower);

    if (in_array($tipoLower, ['entrada', 'entradas'], true)) {
        return 'Entrada';
    }

    if (in_array($tipoLower, ['saida', 'saidas'], true)) {
        return 'Saída';
    }

    return $tipo;
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
    // Valida Token e pega ID do usuário
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $currentUser = $stmt->fetch();

    if (!$currentUser) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido']);
        exit;
    }

    $user_id = $currentUser['id'];
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    // GET: Listar
    if ($method === 'GET') {
        $sql = "SELECT * FROM lancamentos WHERE user_id = :uid ORDER BY data DESC, created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':uid' => $user_id]);
        $data = $stmt->fetchAll();

        foreach ($data as &$item) {
            $item['valor'] = (float) $item['valor'];

            $tipoNormalizado = normalize_tipo($item['tipo'] ?? '');

            if ($tipoNormalizado === 'Entrada') {
                $item['tipo_normalizado'] = 'entrada';
            } elseif ($tipoNormalizado === 'Saída') {
                $item['tipo_normalizado'] = 'saida';
            } else {
                $item['tipo_normalizado'] = strtolower(trim((string) ($item['tipo'] ?? '')));
            }
        }
        unset($item);

        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }

    // POST: Inserir
    if ($method === 'POST') {
        if (empty($input['descricao']) || !isset($input['valor'])) {
            throw new Exception("Descrição e Valor são obrigatórios");
        }

        $tipo = normalize_tipo($input['tipo'] ?? 'Entrada');

        $sql = "INSERT INTO lancamentos (
                    user_id,
                    tipo,
                    categoria,
                    descricao,
                    valor,
                    data,
                    forma_pagamento,
                    observacoes
                ) VALUES (
                    :uid,
                    :tipo,
                    :cat,
                    :desc,
                    :val,
                    :data,
                    :pag,
                    :obs
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $user_id,
            ':tipo' => $tipo,
            ':cat' => $input['categoria'],
            ':desc' => $input['descricao'],
            ':val' => (float) $input['valor'],
            ':data' => $input['data'],
            ':pag' => $input['formaPagamento'] ?? 'Pix',
            ':obs' => $input['observacoes'] ?? ''
        ]);

        $lastId = $pdo->lastInsertId();

        $stmtRead = $pdo->prepare("SELECT * FROM lancamentos WHERE id = ?");
        $stmtRead->execute([$lastId]);
        $newItem = $stmtRead->fetch();

        if ($newItem) {
            $newItem['valor'] = (float) $newItem['valor'];

            $tipoNormalizado = normalize_tipo($newItem['tipo'] ?? '');
            $newItem['tipo_normalizado'] = $tipoNormalizado === 'Entrada' ? 'entrada' : 'saida';
        }

        echo json_encode(['success' => true, 'data' => $newItem]);
        exit;
    }

    // PUT: Alterar
    if ($method === 'PUT') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception("ID não informado para alteração");
        }

        $check = $pdo->prepare("SELECT id FROM lancamentos WHERE id = :id AND user_id = :uid");
        $check->execute([':id' => $id, ':uid' => $user_id]);

        if (!$check->fetch()) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Ação não permitida']);
            exit;
        }

        $tipo = normalize_tipo($input['tipo'] ?? 'Entrada');

        $sql = "UPDATE lancamentos SET
                    tipo = :tipo,
                    categoria = :cat,
                    descricao = :desc,
                    valor = :val,
                    data = :data,
                    forma_pagamento = :pag,
                    observacoes = :obs
                WHERE id = :id AND user_id = :uid";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':tipo' => $tipo,
            ':cat' => $input['categoria'],
            ':desc' => $input['descricao'],
            ':val' => (float) $input['valor'],
            ':data' => $input['data'],
            ':pag' => $input['formaPagamento'],
            ':obs' => $input['observacoes'] ?? '',
            ':id' => $id,
            ':uid' => $user_id
        ]);

        $stmtRead = $pdo->prepare("SELECT * FROM lancamentos WHERE id = ?");
        $stmtRead->execute([$id]);
        $updatedItem = $stmtRead->fetch();

        if ($updatedItem) {
            $updatedItem['valor'] = (float) $updatedItem['valor'];

            $tipoNormalizado = normalize_tipo($updatedItem['tipo'] ?? '');
            $updatedItem['tipo_normalizado'] = $tipoNormalizado === 'Entrada' ? 'entrada' : 'saida';
        }

        echo json_encode(['success' => true, 'data' => $updatedItem]);
        exit;
    }

    // DELETE: Excluir
    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception("ID não informado para exclusão");
        }

        $stmt = $pdo->prepare("DELETE FROM lancamentos WHERE id = :id AND user_id = :uid");
        $stmt->execute([':id' => $id, ':uid' => $user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Lançamento excluído']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Nenhum registro encontrado ou sem permissão']);
        }
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}