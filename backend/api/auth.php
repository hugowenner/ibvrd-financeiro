<?php
// backend/api/auth.php

// O config.php já cuida do CORS e da conexão com o banco
require_once 'config.php'; 

// O config.php já tratou o OPTIONS (Preflight), podemos validar o método POST
// (Isso só roda se NÃO for OPTIONS, graças ao exit no config.php)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

 $input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email e senha obrigatórios']);
    exit;
}

 $email = trim($input['email']);
 $password = $input['password'];

try {
    // Busca usuário
    $stmt = $pdo->prepare("SELECT id, nome, email, password, role FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
        exit;
    }

    // Gera novo token
    $token = bin2hex(random_bytes(32));
    
    $update = $pdo->prepare("UPDATE users SET api_token = :token WHERE id = :id");
    $update->execute(['token' => $token, 'id' => $user['id']]);

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'nome' => $user['nome'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}