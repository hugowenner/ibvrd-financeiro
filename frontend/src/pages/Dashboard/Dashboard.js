// src/pages/Dashboard.js
import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
    const { lancamentos, loading } = useContext(FinanceContext);

    // 1. Cálculo de Entradas, Saídas e Saldo
    const resumo = useMemo(() => {
        const totalEntradas = lancamentos
            .filter(l => l && l.tipo === 'Entrada') // Verifica segurança
            .reduce((sum, l) => sum + (parseFloat(l.valor) || 0), 0); // CORREÇÃO: parseFloat || 0
        
        const totalSaidas = lancamentos
            .filter(l => l && l.tipo === 'Saída') // Verifica segurança
            .reduce((sum, l) => sum + (parseFloat(l.valor) || 0), 0); // CORREÇÃO: parseFloat || 0

        const saldo = totalEntradas - totalSaidas;

        return { totalEntradas, totalSaidas, saldo };
    }, [lancamentos]);

    // 2. Cálculo Dinâmico para Distribuição por Categoria
    const distribuicao = useMemo(() => {
        // Soma os valores por categoria
        const totals = lancamentos.reduce((acc, item) => {
            // Adicionado verificação para garantir que 'item' existe
            if (!item) return acc;

            // CORREÇÃO: parseFloat || 0
            acc[item.categoria] = (acc[item.categoria] || 0) + (parseFloat(item.valor) || 0);
            return acc;
        }, {});

        // Transforma o objeto em array
        const data = Object.entries(totals).map(([categoria, total]) => ({
            categoria,
            total
        }));

        // Ordena do maior para o menor
        data.sort((a, b) => b.total - a.total);

        // Encontra o valor máximo para calcular a porcentagem da barra
        const maxVal = data.length > 0 ? data[0].total : 0;

        return { data, maxVal };
    }, [lancamentos]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8 md:mb-10 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Visão Financeira</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Resumo geral das movimentações.</p>
            </div>
            
            {/* CARDS DE RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                <Card title="Entradas" value={formatCurrency(resumo.totalEntradas)} valueColor="text-positivo" />
                <Card title="Saídas" value={formatCurrency(resumo.totalSaidas)} valueColor="text-negativo" />
                <Card title="Saldo Atual" value={formatCurrency(resumo.saldo)} valueColor={resumo.saldo >= 0 ? "text-positivo" : "text-negativo"} />
            </div>
            
            {/* SEÇÃO DE DISTRIBUIÇÃO DINÂMICA */}
            <div className="bg-white border border-gray-100 shadow-sm p-4 md:p-8 rounded-2xl">
                <h3 className="text-lg md:text-xl font-serif text-gray-800 font-semibold mb-6 md:mb-8 border-b border-gray-50 pb-4">Distribuição por Categoria</h3>
                
                {distribuicao.data.length === 0 ? (
                    <p className="text-sm text-gray-500">Sem dados suficientes para gerar gráfico.</p>
                ) : (
                    <div className="space-y-4 md:space-y-6">
                        {distribuicao.data.map((item) => {
                            // Calcula a porcentagem em relação ao maior valor
                            const percentagem = distribuicao.maxVal > 0 ? (item.total / distribuicao.maxVal) * 100 : 0;
                            
                            return (
                                <div key={item.categoria}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs md:text-sm font-medium text-gray-600 font-sans">{item.categoria}</span>
                                        <span className="text-xs md:text-sm font-bold text-gray-900 font-mono">{formatCurrency(item.total)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: `${percentagem}%`}}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;