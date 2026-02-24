<?php
// backend/api/auth.php

// =================================================================
// 1. CONFIGURAÇÃO DO DEBUGGER
// =================================================================
// Ativa exibição de erros na tela (útil para desenvolvimento)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Função personalizada para escrever no arquivo de log
function debugger_log($message) {
    $logFile = __DIR__ . '/debug_log.txt';
    $timestamp = date("Y-m-d H:i:s");
    // Formata a mensagem e adiciona uma quebra de linha
    file_put_contents($logFile, "[{$timestamp}] {$message}\n", FILE_APPEND);
}

// Log inicial da requisição
debugger_log("NOVA REQUISIÇÃO RECEBIDA");
debugger_log("Método: " . $_SERVER['REQUEST_METHOD']);
debugger_log("Headers: " . print_r(getallheaders(), true));

// =================================================================
// 2. CONFIGURAÇÃO DE CORS (Essencial para React)
// =================================================================
// Permite que o React (na porta 3000 ou outra) acesse este PHP
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// =================================================================
// 3. TRATAMENTO DO PREFLIGHT (OPTIONS)
// =================================================================
// O navegador envia uma requisição OPTIONS antes do POST para verificar permissões.
// Se não respondermos OK aqui, o navegador bloqueia o POST real.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    debugger_log("Requisição OPTIONS recebida. Retornando 200 OK.");
    http_response_code(200);
    exit;
}

// =================================================================
// 4. LÓGICA DE AUTENTICAÇÃO
// =================================================================

require_once 'config.php'; 

// Validação do Método (Agora o OPTIONS já foi tratado acima, então validamos apenas POST)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debugger_log("ERRO: Método não permitido (" . $_SERVER['REQUEST_METHOD'] . ")");
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

// Recebimento de Dados (Raw Input)
 $rawInput = file_get_contents('php://input');
debugger_log("Input Bruto Recebido: " . $rawInput);

 $input = json_decode($rawInput, true);

// Verifica se o JSON é válido
if (json_last_error() !== JSON_ERROR_NONE) {
    debugger_log("ERRO: JSON Inválido - " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'JSON inválido']);
    exit;
}

if (!$input || empty($input['email']) || empty($input['password'])) {
    debugger_log("ERRO: Campos vazios. Email ou senha não enviados.");
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email e senha obrigatórios']);
    exit;
}

 $email = trim($input['email']);
 $password = $input['password'];

debugger_log("Tentativa de login para: " . $email);

try {
    // Busca usuário
    $stmt = $pdo->prepare("SELECT id, nome, email, password, role FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        debugger_log("ERRO: Usuário não encontrado.");
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
        exit;
    }

    debugger_log("Usuário encontrado. Verificando senha...");

    if (!password_verify($password, $user['password'])) {
        debugger_log("ERRO: Senha incorreta.");
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
        exit;
    }

    // ============================================
    // GERAÇÃO DE TOKEN
    // ============================================
    $token = bin2hex(random_bytes(32));
    debugger_log("Senha correta. Gerando token: " . substr($token, 0, 10) . "...");
    
    // Atualiza o token no banco
    $update = $pdo->prepare("UPDATE users SET api_token = :token WHERE id = :id");
    $update->execute(['token' => $token, 'id' => $user['id']]);

    debugger_log("Login realizado com sucesso! ID: " . $user['id']);

    // Retorna o Token e os dados do usuário
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
    debugger_log("FATAL ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}