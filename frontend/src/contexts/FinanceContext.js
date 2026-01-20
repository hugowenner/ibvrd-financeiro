// src/contexts/FinanceContext.js
import React, { createContext, useState, useEffect } from 'react';
import { financeApi } from '../services/api'; 

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchLancamentos = async () => {
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return;
            }

            try {
                const response = await financeApi.getLancamentos();
                setLancamentos(response.data);
            } catch (error) {
                console.error("Falha ao buscar lançamentos:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLancamentos();
    }, []);

    const addLancamento = async (lancamentoData) => {
        try {
            const response = await financeApi.addLancamento(lancamentoData);
            
            if (response && response.data) {
                setLancamentos(prevLancamentos => [...prevLancamentos, response.data]);
            } else {
                const fetchResponse = await financeApi.getLancamentos();
                if(fetchResponse.data) setLancamentos(fetchResponse.data);
            }
            
            return response.data;
        } catch (error) {
            console.error("Falha ao adicionar lançamento:", error);
            throw error;
        }
    };

    // ============================================
    // FUNÇÃO DE EXCLUSÃO (NOVA)
    // ============================================
    const deleteLancamento = async (id) => {
        try {
            // Faz a chamada DELETE passando o ID na URL
            await financeApi.request(`lancamentos.php?id=${id}`, 'DELETE');
            
            // Remove o item da lista local (React State)
            setLancamentos(prevLancamentos => prevLancamentos.filter(l => l.id !== id));
            
            // Notifica usuário
            notify('Lançamento excluído com sucesso!', 'success');
        } catch (error) {
            console.error("Falha ao excluir lançamento:", error);
            notify('Erro ao excluir lançamento.', 'error');
            throw error;
        }
    };

    const notify = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <FinanceContext.Provider value={{ 
            lancamentos, 
            loading, 
            addLancamento, 
            deleteLancamento, // <--- EXPORTADO AQUI
            notification, 
            notify 
        }}>
            {children}
        </FinanceContext.Provider>
    );
};