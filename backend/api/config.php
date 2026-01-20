<?php
// backend/api/config.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// FUNÇÃO DE CORS (Idêntica à do Cadastro)
// ===============================
function sendCorsHeaders() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://financeiro.ibvrd.com.br',
        'https://www.financeiro.ibvrd.com.br',
        'http://localhost:3001', // Adicionei porta comum de testes
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if ($origin && in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true"); // Necessário para casos futuros, mas aqui usamos Token
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
}

// Tratamento do Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendCorsHeaders();
    http_response_code(200);
    exit;
}

// Headers normais
sendCorsHeaders();
header("Content-Type: application/json; charset=UTF-8");

// ===============================
// CONEXÃO COM BANCO DE DADOS
// ===============================
 $hostCheck = $_SERVER['HTTP_HOST'] ?? '';
 $isLocal = (strpos($hostCheck, 'localhost') !== false || strpos($hostCheck, '127.0.0.1') !== false);

try {
    if ($isLocal) {
        // SQLite (Local)
        $dbPath = __DIR__ . '/../database/financeiro.sqlite';
        if (!file_exists(__DIR__ . '/../database')) {
            mkdir(__DIR__ . '/../database', 0777, true);
        }
        $pdo = new PDO("sqlite:$dbPath");
    } else {
        // MySQL (Produção HostGator)
        $host = "localhost";
        $dbname = "thia7642_pessoas_db";
        $user = "thia7642_hugowenner";
        $pass = "@Geforce9600gt";

        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $user,
            $pass
        );
    }
    
    // Configurações Padrão PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro de conexão com o banco de dados',
        'details' => $e->getMessage()
    ]);
    exit;
}