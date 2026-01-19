// src/services/api.js

// 1. Leitura dinâmica da URL base via Variáveis de Ambiente
// Quando roda 'npm start', pega do .env.development
// Quando roda 'npm run build', pega do .env.production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper para requisições autenticadas
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
    };

    // Se tiver token, insere no header
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        // Constrói a URL completa (Base URL + Endpoint)
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
        
        // Tratamento específico para 401 (Não autorizado/Token expirou)
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Redireciona forçadamente para o login
            throw new Error('Sessão expirada');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Tenta pegar erro detalhado
            throw new Error(errorData?.error || 'Erro na requisição');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Exporta funções específicas para o contexto financeiro
export const financeApi = {
    // LOGIN (Não precisa de token antes)
    login: async (email, password) => {
        return await apiRequest('auth.php', 'POST', { email, password });
    },

    // LISTAR LANÇAMENTOS
    getLancamentos: async () => {
        return await apiRequest('lancamentos.php', 'GET'); 
    },

    // ADICIONAR LANÇAMENTO
    addLancamento: async (data) => {
        return await apiRequest('lancamentos.php', 'POST', data);
    }
};