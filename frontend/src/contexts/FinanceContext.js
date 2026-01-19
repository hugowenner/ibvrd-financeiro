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
            // IMPEDIR LOOP: Se não houver token, para por aqui.
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return;
            }

            try {
                const response = await financeApi.getLancamentos();
                setLancamentos(response.data);
            } catch (error) {
                console.error("Falha ao buscar lançamentos:", error);
                // Se for erro 401, o api.js já redireciona, não precisa fazer nada aqui
            } finally {
                setLoading(false);
            }
        };
        
        fetchLancamentos();
    }, []);

    const addLancamento = async (lancamentoData) => {
        try {
            const response = await financeApi.addLancamento(lancamentoData);
            
            // CORREÇÃO: Verifica se o PHP retornou o objeto 'data' antes de adicionar
            if (response && response.data) {
                setLancamentos(prevLancamentos => [...prevLancamentos, response.data]);
            } else {
                // Fallback: Se o backend falhar em retornar o objeto, recarrega a lista
                // (Isso garante que o usuário veja o dado mesmo se o PHP não estiver 100% ajustado)
                const fetchResponse = await financeApi.getLancamentos();
                if(fetchResponse.data) setLancamentos(fetchResponse.data);
            }
            
            return response.data;
        } catch (error) {
            console.error("Falha ao adicionar lançamento:", error);
            throw error;
        }
    };

    const notify = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <FinanceContext.Provider value={{ lancamentos, loading, addLancamento, notification, notify }}>
            {children}
        </FinanceContext.Provider>
    );
};