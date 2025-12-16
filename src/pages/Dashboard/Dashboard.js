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
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title="Total de Entradas" value={formatCurrency(resumo.totalEntradas)} valueColor="text-positivo" />
                <Card title="Total de Saídas" value={formatCurrency(resumo.totalSaidas)} valueColor="text-negativo" />
                <Card title="Saldo Atual" value={formatCurrency(resumo.saldo)} valueColor={resumo.saldo >= 0 ? "text-positivo" : "text-negativo"} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumo por Categoria (Mock)</h3>
                {/* Gráfico simples mockado - pode ser substituído por uma biblioteca no futuro */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Dízimo</span>
                        <span className="text-sm font-bold text-gray-800">{formatCurrency(8000)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-azul-ibvrd h-2.5 rounded-full" style={{width: '70%'}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Oferta</span>
                        <span className="text-sm font-bold text-gray-800">{formatCurrency(5500)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-azul-ibvrd h-2.5 rounded-full" style={{width: '50%'}}></div>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Despesas Fixas</span>
                        <span className="text-sm font-bold text-gray-800">{formatCurrency(7800)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-negativo h-2.5 rounded-full" style={{width: '65%'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;