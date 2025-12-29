import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm/FinanceForm';
import Filters from '../../components/Filters/Filters';
import Table from '../../components/Table/Table';
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
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900 font-normal">Lançamentos Financeiros</h2>
                <p className="text-gray-500 mt-2 font-light">Gestão detalhada de entradas e saídas.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Coluna do Formulário */}
                <div className="lg:col-span-4 space-y-6">
                    <FinanceForm />
                </div>

                {/* Coluna da Lista e Filtros */}
                <div className="lg:col-span-8 space-y-6">
                    <Filters filters={filters} onFilterChange={handleFilterChange} />
                    
                    {/* Mini Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entradas</span>
                            <span className="text-xl font-bold text-green-700 font-serif mt-1">{formatCurrency(totalFiltrado.totalEntradas)}</span>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saídas</span>
                            <span className="text-xl font-bold text-red-700 font-serif mt-1">{formatCurrency(totalFiltrado.totalSaidas)}</span>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg flex flex-col justify-center items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo</span>
                            <span className={`text-xl font-bold font-serif mt-1 ${totalFiltrado.saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>
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