import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento } = useContext(FinanceContext);

    // Estado para os filtros
    const [filters, setFilters] = useState({
        tipo: '',
        categoria: '',
        dataInicial: '',
        dataFinal: ''
    });

    // Função para atualizar os filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Lógica de Filtragem dos Dados
    const filteredLancamentos = useMemo(() => {
        return lancamentos.filter(item => {
            // Verifica se o item existe (segurança)
            if (!item) return false;

            // Filtro por Tipo
            if (filters.tipo && item.tipo !== filters.tipo) return false;

            // Filtro por Categoria
            if (filters.categoria && item.categoria !== filters.categoria) return false;

            // Filtro por Data Inicial
            if (filters.dataInicial && item.data < filters.dataInicial) return false;

            // Filtro por Data Final
            if (filters.dataFinal && item.data > filters.dataFinal) return false;

            return true;
        });
    }, [lancamentos, filters]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Cabeçalho da Página */}
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Gestão de Lançamentos</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Adicione, filtre e visualize suas movimentações.</p>
            </div>

            {/* Layout Grid: Formulário à Esquerda, Lista à Direita */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                
                {/* COLUNA ESQUERDA: Formulário de Entrada (Ocupa 4 colunas no LG) */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-24">
                        <FinanceForm />
                    </div>
                </div>

                {/* COLUNA DIREITA: Filtros e Tabela (Ocupa 8 colunas no LG) */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                    
                    {/* Componente de Filtros */}
                    <Filters filters={filters} onFilterChange={handleFilterChange} />

                    {/* Componente de Tabela com prop onDelete */}
                    <Table data={filteredLancamentos} onDelete={deleteLancamento} />

                </div>
            </div>
        </div>
    );
};

export default Lancamentos;