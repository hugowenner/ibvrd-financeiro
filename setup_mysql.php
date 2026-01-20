<?php
// backend/api/setup_mysql.php
require_once 'config.php';

echo "<h2>Instalando Banco de Dados MySQL...</h2>";

try {
    // 1. Tabela de Usuários (Sintaxe MySQL)
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        api_token VARCHAR(255)
    )";
    $pdo->exec($sqlUsers);
    echo "- Tabela 'users' criada ou já existente.<br>";

    // 2. Tabela de Lançamentos (Sintaxe MySQL)
    // DECIMAL(10,2) garante precisão financeira (ex: 1000.00)
    $sqlLancamentos = "CREATE TABLE IF NOT EXISTS lancamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        descricao TEXT NOT NULL,
        valor DECIMAL(10, 2) NOT NULL, 
        data DATE NOT NULL,
        forma_pagamento VARCHAR(50) NOT NULL,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )";
    $pdo->exec($sqlLancamentos);
    echo "- Tabela 'lancamentos' criada ou já existente.<br>";

    // 3. Criar Usuário Admin de Teste
    $check = $pdo->query("SELECT count(*) FROM users")->fetchColumn();
    
    if ($check == 0) {
        // Dados do usuário
        $senhaHash = password_hash('123456', PASSWORD_DEFAULT); // Senha Padrão
        $token = bin2hex(random_bytes(32));
        
        $stmt = $pdo->prepare("INSERT INTO users (nome, email, password, role, api_token) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Admin IBVRD', 'admin@ibvrd.com.br', $senhaHash, 'admin', $token]);
        
        echo "<br><strong style='color:green'>✅ Usuário Admin inserido com sucesso!</strong><br>";
        echo "Email: <strong>admin@ibvrd.com.br</strong><br>";
        echo "Senha: <strong>123456</strong>";
    } else {
        echo "<br><strong style='color:orange'>⚠️ Usuários já existem. Nenhum novo usuário criado.</strong>";
    }

} catch (Exception $e) {
    echo "<br><strong style='color:red'>❌ Erro na criação das tabelas:</strong><br>";
    echo $e->getMessage();
}