// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Pega o token salvo no localStorage
    const token = localStorage.getItem('token');

    // Adiciona o header Authorization se o token existir
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        // Removido credentials: 'include' pois não usamos mais cookies de sessão
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
        
        // Se o token for inválido (401), desloga o usuário
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Redireciona para login
            throw new Error('Sessão expirada ou Token inválido');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Erro na requisição');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const financeApi = {
    login: async (email, password) => {
        return await apiRequest('auth.php', 'POST', { email, password });
    },

    getLancamentos: async () => {
        return await apiRequest('lancamentos.php', 'GET'); 
    },

    addLancamento: async (data) => {
        return await apiRequest('lancamentos.php', 'POST', data);
    }
};