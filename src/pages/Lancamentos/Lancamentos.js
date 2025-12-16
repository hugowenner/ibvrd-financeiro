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
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lançamentos Financeiros</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <FinanceForm />
                </div>
                <div className="lg:col-span-2">
                    <Filters filters={filters} onFilterChange={handleFilterChange} />
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-4 rounded shadow text-center">
                            <p className="text-xs text-gray-500 uppercase">Entradas</p>
                            <p className="text-lg font-bold text-positivo">{formatCurrency(totalFiltrado.totalEntradas)}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow text-center">
                            <p className="text-xs text-gray-500 uppercase">Saídas</p>
                            <p className="text-lg font-bold text-negativo">{formatCurrency(totalFiltrado.totalSaidas)}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow text-center">
                            <p className="text-xs text-gray-500 uppercase">Saldo</p>
                            <p className={`text-lg font-bold ${totalFiltrado.saldo >= 0 ? 'text-positivo' : 'text-negativo'}`}>{formatCurrency(totalFiltrado.saldo)}</p>
                        </div>
                    </div>

                    <Table data={lancamentosFiltrados} />
                </div>
            </div>
        </div>
    );
};

export default Lancamentos;