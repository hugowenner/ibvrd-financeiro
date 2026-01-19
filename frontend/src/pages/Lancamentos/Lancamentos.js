// src/pages/Lancamentos.js
import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';
import { formatCurrency } from '../../utils/formatters';

const Lancamentos = () => {
    const { lancamentos, loading } = useContext(FinanceContext);
    const [filters, setFilters] = useState({
        tipo: '',
        categoria: '',
        dataInicial: '',
        dataFinal: ''
    });

    const lancamentosFiltrados = useMemo(() => {
        return lancamentos.filter(lancamento => {
            const matchTipo = !filters.tipo || lancamento.tipo === filters.tipo;
            const matchCategoria = !filters.categoria || lancamento.categoria === filters.categoria;
            const matchDataInicial = !filters.dataInicial || lancamento.data >= filters.dataInicial;
            const matchDataFinal = !filters.dataFinal || lancamento.data <= filters.dataFinal;
            return matchTipo && matchCategoria && matchDataInicial && matchDataFinal;
        });
    }, [lancamentos, filters]);

    const totalFiltrado = useMemo(() => {
        const totalEntradas = lancamentosFiltrados
            .filter(l => l.tipo === 'Entrada')
            .reduce((sum, l) => sum + l.valor, 0);
        
        const totalSaidas = lancamentosFiltrados
            .filter(l => l.tipo === 'Saída')
            .reduce((sum, l) => sum + l.valor, 0);

        return { totalEntradas, totalSaidas, saldo: totalEntradas - totalSaidas };
    }, [lancamentosFiltrados]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6 md:mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Lançamentos Financeiros</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Gestão detalhada de entradas e saídas.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                {/* Coluna do Formulário */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    <FinanceForm />
                </div>

                {/* Coluna da Lista e Filtros */}
                <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
                    <Filters filters={filters} onFilterChange={handleFilterChange} />
                    
                    {/* Mini Cards de Resumo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-white border border-gray-100 shadow-sm p-4 md:p-5 rounded-2xl flex flex-col justify-center items-center text-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Entradas</span>
                            <span className="text-lg md:text-xl font-bold text-green-700 font-serif">{formatCurrency(totalFiltrado.totalEntradas)}</span>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm p-4 md:p-5 rounded-2xl flex flex-col justify-center items-center text-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saídas</span>
                            <span className="text-lg md:text-xl font-bold text-red-700 font-serif">{formatCurrency(totalFiltrado.totalSaidas)}</span>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm p-4 md:p-5 rounded-2xl flex flex-col justify-center items-center text-center sm:col-span-2 md:col-span-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Saldo</span>
                            <span className={`text-lg md:text-xl font-bold font-serif ${totalFiltrado.saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {formatCurrency(totalFiltrado.saldo)}
                            </span>
                        </div>
                    </div>

                    <Table data={lancamentosFiltrados} />
                </div>
            </div>
        </div>
    );
};

export default Lancamentos;