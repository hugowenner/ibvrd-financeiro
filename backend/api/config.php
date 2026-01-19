<?php
// backend/api/config.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// VERIFICA AMBIENTE
// ===============================
 $isCli = (php_sapi_name() === 'cli');

// ===============================
// FUNÇÃO DE CORS
// ===============================
function sendCorsHeaders() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:8000',
        'https://financeiro.ibvrd.com.br',
        'https://www.financeiro.ibvrd.com.br'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Se a origem estiver na lista permitida, define o header
    // Se for CLI ou origem desconhecida, não define (evita erros de header já enviado)
    if ($origin && in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
}

// ===============================
// FLUXO DE EXECUÇÃO
// ===============================

if (!$isCli) {
    // 1. Se for requisição OPTIONS (Preflight), manda apenas os headers e para
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        sendCorsHeaders();
        http_response_code(200);
        exit;
    }

    // 2. Para requisições normais, manda os headers
    sendCorsHeaders();
    header("Content-Type: application/json; charset=UTF-8");
}

// ===============================
// CONEXÃO COM BANCO DE DADOS
// ===============================
 $hostCheck = $isCli ? 'localhost' : ($_SERVER['HTTP_HOST'] ?? '');
 $isLocal = (strpos($hostCheck, 'localhost') !== false || strpos($hostCheck, '127.0.0.1') !== false || $isCli);

try {
    if ($isLocal) {
        // SQLite (Desenvolvimento)
        $dbPath = __DIR__ . '/../database/financeiro.sqlite';
        
        if (!file_exists(__DIR__ . '/../database')) {
            mkdir(__DIR__ . '/../database', 0777, true);
        }

        $pdo = new PDO("sqlite:$dbPath");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    } else {
        // MySQL (Produção)
        $host = "localhost";
        $dbname = "thia7642_pessoas_db";
        $user = "thia7642_hugowenner";
        $pass = "@Geforce9600gt";

        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
    }
} catch (Throwable $e) {
    if ($isCli) {
        echo "Erro DB: " . $e->getMessage();
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erro de conexão com o banco de dados',
            'details' => $e->getMessage()
        ]);
    }
    exit;
}