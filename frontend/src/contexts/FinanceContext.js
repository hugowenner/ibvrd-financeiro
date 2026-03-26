import React, { createContext, useState, useEffect } from 'react';
import { financeApi } from '../services/api';

// 🔥 FUNÇÕES DE NORMALIZAÇÃO (CRÍTICAS)
const normalizeDate = (dateString) => {
    if (!dateString) return '';

    // remove hora se existir
    if (dateString.includes('T')) return dateString.split('T')[0];
    if (dateString.includes(' ')) return dateString.split(' ')[0];

    return dateString;
};

const parseValue = (value) => {
    if (value === null || value === undefined) return 0;

    if (typeof value === 'number') return value;

    let str = String(value)
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.');

    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
};

// 🔥 NORMALIZAÇÃO COMPLETA DO OBJETO
const normalizeLancamento = (l) => ({
    ...l,
    data: normalizeDate(l.data),
    valor: parseValue(l.valor),
});

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // =========================
    // FETCH INICIAL
    // =========================
    useEffect(() => {
        const fetchLancamentos = async () => {
            if (!localStorage.getItem('token')) {
                setLoading(false);
                return;
            }

            try {
                const response = await financeApi.getLancamentos();

                if (response.success && response.data) {
                    const dadosNormalizados = response.data.map(normalizeLancamento);
                    setLancamentos(dadosNormalizados);
                }
            } catch (error) {
                console.error("Erro ao buscar lançamentos:", error);
                notify('Erro ao carregar dados.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchLancamentos();
    }, []);

    // =========================
    // ADD
    // =========================
    const addLancamento = async (lancamentoData) => {
        try {
            const payload = {
                ...lancamentoData,
                data: normalizeDate(lancamentoData.data),
                valor: parseValue(lancamentoData.valor),
            };

            const response = await financeApi.addLancamento(payload);

            if (response.success && response.data) {
                const novo = normalizeLancamento(response.data);

                setLancamentos(prev => [...prev, novo]);
                notify('Lançamento adicionado!', 'success');

                return novo;
            }
        } catch (error) {
            notify('Erro ao adicionar.', 'error');
            throw error;
        }
    };

    // =========================
    // UPDATE
    // =========================
    const updateLancamento = async (id, lancamentoData) => {
        try {
            const payload = {
                ...lancamentoData,
                data: normalizeDate(lancamentoData.data),
                valor: parseValue(lancamentoData.valor),
            };

            const response = await financeApi.updateLancamento(id, payload);

            if (response.success && response.data) {
                const atualizado = normalizeLancamento(response.data);

                setLancamentos(prev =>
                    prev.map(l => l.id === id ? atualizado : l)
                );

                notify('Lançamento atualizado!', 'success');
                return atualizado;
            }
        } catch (error) {
            notify('Erro ao atualizar.', 'error');
            throw error;
        }
    };

    // =========================
    // DELETE
    // =========================
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

    // =========================
    // NOTIFICAÇÃO
    // =========================
    const notify = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    return (
        <FinanceContext.Provider
            value={{
                lancamentos,
                loading,
                addLancamento,
                updateLancamento,
                deleteLancamento,
                notification,
                notify
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};