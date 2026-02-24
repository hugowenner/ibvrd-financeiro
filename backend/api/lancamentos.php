<?php
// backend/api/lancamentos.php
require_once 'config.php';

// =================================================================
// MELHORIA: Define o tipo de conteúdo imediatamente
// =================================================================
header('Content-Type: application/json; charset=utf-8');

// Tratamento rápido para o preflight do CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// Middleware Auth
 $headers = getallheaders();
 $authHeader = $headers['Authorization'] ?? '';
 $token = str_replace('Bearer ', '', $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token ausente']);
    exit; // MELHORIA: Força parada
}

try {
    // Valida Token e pega ID do usuário
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $currentUser = $stmt->fetch();

    if (!$currentUser) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido']);
        exit; // MELHORIA: Força parada
    }

    $user_id = $currentUser['id'];
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    // ==========================================
    // GET: Listar
    // ==========================================
    if ($method === 'GET') {
        $sql = "SELECT * FROM lancamentos WHERE user_id = :uid ORDER BY data DESC, created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':uid' => $user_id]);
        $data = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $data]);
        exit; // MELHORIA: Força parada
    } 

    // ==========================================
    // POST: Inserir
    // ==========================================
    elseif ($method === 'POST') {
        if (empty($input['descricao']) || !isset($input['valor'])) {
            throw new Exception("Descrição e Valor são obrigatórios");
        }

        $sql = "INSERT INTO lancamentos (user_id, tipo, categoria, descricao, valor, data, forma_pagamento, observacoes) 
                VALUES (:uid, :tipo, :cat, :desc, :val, :data, :pag, :obs)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':uid' => $user_id,
            ':tipo' => $input['tipo'] ?? 'Entrada',
            ':cat' => $input['categoria'],
            ':desc' => $input['descricao'],
            ':val' => $input['valor'],
            ':data' => $input['data'],
            ':pag' => $input['formaPagamento'] ?? 'Pix',
            ':obs' => $input['observacoes'] ?? ''
        ]);

        $lastId = $pdo->lastInsertId();
        // Retorna o objeto criado
        $stmtRead = $pdo->prepare("SELECT * FROM lancamentos WHERE id = ?");
        $stmtRead->execute([$lastId]);
        $newItem = $stmtRead->fetch();

        echo json_encode(['success' => true, 'data' => $newItem]);
        exit; // MELHORIA: Força parada
    } 

    // ==========================================
    // PUT: Alterar
    // ==========================================
    elseif ($method === 'PUT') {
        $id = $_GET['id'] ?? null;
        if (!$id) throw new Exception("ID não informado para alteração");

        // Verifica permissão
        $check = $pdo->prepare("SELECT id FROM lancamentos WHERE id = :id AND user_id = :uid");
        $check->execute([':id' => $id, ':uid' => $user_id]);
        if (!$check->fetch()) {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Ação não permitida']);
            exit; // MELHORIA: Força parada
        }

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
            ':tipo' => $input['tipo'],
            ':cat' => $input['categoria'],
            ':desc' => $input['descricao'],
            ':val' => $input['valor'],
            ':data' => $input['data'],
            ':pag' => $input['formaPagamento'],
            ':obs' => $input['observacoes'] ?? '',
            ':id' => $id,
            ':uid' => $user_id
        ]);

        $stmtRead = $pdo->prepare("SELECT * FROM lancamentos WHERE id = ?");
        $stmtRead->execute([$id]);
        $updatedItem = $stmtRead->fetch();

        echo json_encode(['success' => true, 'data' => $updatedItem]);
        exit; // MELHORIA: Força parada
    }

    // ==========================================
    // DELETE: Excluir
    // ==========================================
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) throw new Exception("ID não informado para exclusão");

        $stmt = $pdo->prepare("DELETE FROM lancamentos WHERE id = :id AND user_id = :uid");
        $stmt->execute([':id' => $id, ':uid' => $user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Lançamento excluído']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Nenhum registro encontrado ou sem permissão']);
        }
        exit; // MELHORIA: Força parada (garante que nada mais rode depois disso)
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit; // MELHORIA: Força parada
}