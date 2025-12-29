import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card/Card';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
    const { lancamentos, loading } = useContext(FinanceContext);

    const resumo = useMemo(() => {
        const totalEntradas = lancamentos
            .filter(l => l.tipo === 'Entrada')
            .reduce((sum, l) => sum + l.valor, 0);
        
        const totalSaidas = lancamentos
            .filter(l => l.tipo === 'Saída')
            .reduce((sum, l) => sum + l.valor, 0);

        const saldo = totalEntradas - totalSaidas;

        return { totalEntradas, totalSaidas, saldo };
    }, [lancamentos]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900 font-normal">Visão Financeira</h2>
                <p className="text-gray-500 mt-2 font-light">Resumo geral das movimentações.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card title="Total de Entradas" value={formatCurrency(resumo.totalEntradas)} valueColor="text-positivo" />
                <Card title="Total de Saídas" value={formatCurrency(resumo.totalSaidas)} valueColor="text-negativo" />
                <Card title="Saldo Atual" value={formatCurrency(resumo.saldo)} valueColor={resumo.saldo >= 0 ? "text-positivo" : "text-negativo"} />
            </div>
            
            <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-lg">
                <h3 className="text-xl font-serif text-gray-800 font-medium mb-6">Distribuição por Categoria</h3>
                <div className="space-y-6">
                    {/* Mock Chart Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-600 font-serif">Dízimo</span>
                            <span className="text-sm font-bold text-gray-900 font-mono">{formatCurrency(8000)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '70%'}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-600 font-serif">Oferta</span>
                            <span className="text-sm font-bold text-gray-900 font-mono">{formatCurrency(5500)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '50%'}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-600 font-serif">Despesas Fixas</span>
                            <span className="text-sm font-bold text-gray-900 font-mono">{formatCurrency(7800)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-red-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: '65%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;