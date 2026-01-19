<?php
// backend/api/lancamentos.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; } // Preflight

// Middleware Auth
 $headers = getallheaders();
 $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');

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

    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'GET') {
        $sql = "SELECT * FROM lancamentos ORDER BY data DESC, created_at DESC";
        $stmt = $pdo->query($sql);
        $data = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $data]);
    } 
    elseif ($method === 'POST') {
        if (empty($input['descricao']) || !isset($input['valor'])) throw new Exception("Dados inválidos");

        $sql = "INSERT INTO lancamentos (user_id, tipo, categoria, descricao, valor, data, forma_pagamento, observacoes) 
                VALUES (:uid, :tipo, :cat, :desc, :val, :data, :pag, :obs)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':uid' => $currentUser['id'],
            ':tipo' => $input['tipo'] ?? 'Entrada',
            ':cat' => $input['categoria'],
            ':desc' => $input['descricao'],
            ':val' => $input['valor'],
            ':data' => $input['data'],
            ':pag' => $input['formaPagamento'] ?? 'Pix',
            ':obs' => $input['observacoes'] ?? ''
        ]);
        echo json_encode(['success' => true, 'message' => 'Salvo']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}