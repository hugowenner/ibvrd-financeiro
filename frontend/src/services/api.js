// src/services/api.js

const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/api'; 
    }
    return 'https://financeiro.ibvrd.com.br/backend/api';
};

const API_URL = getBaseUrl();

async function request(endpoint, method = 'GET', data = null) {
    
    // =================================================================
    // CORREÇÃO: Cache Busting (Anti-Cache)
    // =================================================================
    let url = `${API_URL}/${endpoint}`;
    if (endpoint === 'auth.php') {
        url += `?nocache=${new Date().getTime()}`;
    }
    // =================================================================

    const headers = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Configuração da requisição
    const config = {
        method,
        headers,
    };

    // Se houver dados (POST/PUT), adicionamos ao corpo da requisição
    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        // =================================================================
        // CORREÇÃO CRÍTICA AQUI:
        // O fetch estava faltando o segundo argumento 'config'.
        // Sem isso, ele envia um GET vazio, causando o erro 405.
        // =================================================================
        const response = await fetch(url, config);
        
        // Tratamento de 401 (Não autorizado)
        if (response.status === 401) {
            console.warn('Sessão expirada ou inválida. Redirecionando...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Sessão expirada.');
        }

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta do servidor inválida. Verifique se o PHP está rodando.');
        }

        if (!response.ok) {
            throw new Error(result.error || `Erro ${response.status}`);
        }

        return result;
    } catch (error) {
        if (error.message !== 'Sessão expirada.') {
            console.error(`[API Error] ${method} ${endpoint}:`, error);
        }
        throw error;
    }
}

export const financeApi = {
    login: async (email, password) => {
        return request('auth.php', 'POST', { email, password });
    },

    getLancamentos: async () => {
        return request('lancamentos.php', 'GET');
    },

    addLancamento: async (data) => {
        return request('lancamentos.php', 'POST', data);
    },

    updateLancamento: async (id, data) => {
        return request(`lancamentos.php?id=${id}`, 'PUT', data);
    },

    deleteLancamento: async (id) => {
        return request(`lancamentos.php?id=${id}`, 'DELETE');
    }
};