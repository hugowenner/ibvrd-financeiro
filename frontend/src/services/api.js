// src/services/api.js

const getBaseUrl = () => {
    // Detecta se está em produção ou desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Ajuste a porta/caminho conforme seu servidor local (XAMPP, WAMP, PHP -S)
        return 'http://localhost:8000/api'; 
    }
    // URL de produção (ajuste para seu domínio real)
    return 'https://financeiro.ibvrd.com.br/backend/api';
};

const API_URL = getBaseUrl();

// Função genérica de requisição
async function request(endpoint, method = 'GET', data = null) {
    const url = `${API_URL}/${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
    };

    // Pega o token salvo no login
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Erro desconhecido na API');
        }

        return result;
    } catch (error) {
        console.error(`Erro na requisição ${method} ${endpoint}:`, error);
        throw error;
    }
}

export const financeApi = {
    // Autenticação
    login: async (email, password) => {
        return request('auth.php', 'POST', { email, password });
    },

    // Lançamentos
    getLancamentos: async () => {
        return request('lancamentos.php', 'GET');
    },

    addLancamento: async (data) => {
        return request('lancamentos.php', 'POST', data);
    },

    updateLancamento: async (id, data) => {
        // Envia ID no corpo ou query param, aqui optei por enviar no corpo para simplificar
        return request(`lancamentos.php?id=${id}`, 'PUT', data);
    },

    deleteLancamento: async (id) => {
        return request(`lancamentos.php?id=${id}`, 'DELETE');
    }
};