<?php
// backend/api/setup_db.php
require_once 'config.php';

try {
    // Criação das Tabelas (SQLite e MySQL aceitam essa sintaxe básica)
    
    // 1. Tabela de Usuários
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        api_token TEXT
    )");

    // 2. Tabela de Lançamentos
    $pdo->exec("CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tipo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data TEXT NOT NULL,
        forma_pagamento TEXT NOT NULL,
        observacoes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");

    // Verifica se já existe usuário para não duplicar
    $check = $pdo->query("SELECT count(*) FROM users")->fetchColumn();
    
    if ($check == 0) {
        $senhaHash = password_hash('123456', PASSWORD_DEFAULT); // Senha Padrão
        $token = bin2hex(random_bytes(32));
        
        $stmt = $pdo->prepare("INSERT INTO users (nome, email, password, role, api_token) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Admin Teste', 'admin@teste.com', $senhaHash, 'admin', $token]);
        
        echo json_encode(['success' => true, 'message' => 'Banco criado e Usuário Admin inserido!']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Banco de dados já configurado.']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}