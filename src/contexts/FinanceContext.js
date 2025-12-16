import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLancamentos = async () => {
            try {
                const response = await api.getLancamentos();
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
            const response = await api.addLancamento(lancamentoData);
            setLancamentos(prevLancamentos => [...prevLancamentos, response.data]);
            return response.data;
        } catch (error) {
            console.error("Falha ao adicionar lançamento:", error);
            throw error;
        }
    };

    return (
        <FinanceContext.Provider value={{ lancamentos, loading, addLancamento }}>
            {children}
        </FinanceContext.Provider>
    );
};