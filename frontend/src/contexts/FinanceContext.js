// src/contexts/FinanceContext.js
import React, { createContext, useState, useEffect } from 'react';
import { financeApi } from '../services/api'; 

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // Carregar dados inicial
    useEffect(() => {
        const fetchLancamentos = async () => {
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return;
            }
            try {
                const response = await financeApi.getLancamentos();
                if (response.success && response.data) {
                    setLancamentos(response.data);
                }
            } catch (error) {
                console.error("Falha ao buscar lançamentos:", error);
                notify('Erro ao carregar dados.', 'error');
            } finally {
                setLoading(false);
            }
        };
        
        fetchLancamentos();
    }, []);

    // Adicionar
    const addLancamento = async (lancamentoData) => {
        try {
            const response = await financeApi.addLancamento(lancamentoData);
            if (response.success && response.data) {
                setLancamentos(prev => [...prev, response.data]);
                notify('Lançamento adicionado!', 'success');
                return response.data;
            }
        } catch (error) {
            notify('Erro ao adicionar.', 'error');
            throw error;
        }
    };

    // Atualizar (NOVO)
    const updateLancamento = async (id, lancamentoData) => {
        try {
            const response = await financeApi.updateLancamento(id, lancamentoData);
            if (response.success && response.data) {
                setLancamentos(prev => 
                    prev.map(l => l.id === id ? response.data : l)
                );
                notify('Lançamento atualizado!', 'success');
                return response.data;
            }
        } catch (error) {
            notify('Erro ao atualizar.', 'error');
            throw error;
        }
    };

    // Excluir
    const deleteLancamento = async (id) => {
        try {
            await financeApi.deleteLancamento(id);
            setLancamentos(prev => prev.filter(l => l.id !== id));
            notify('Lançamento excluído!', 'success');
        } catch (error) {
            notify('Erro ao excluir.', 'error');
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
            updateLancamento, // Exportado
            deleteLancamento, 
            notification, 
            notify 
        }}>
            {children}
        </FinanceContext.Provider>
    );
};