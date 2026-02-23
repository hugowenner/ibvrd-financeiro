// src/pages/Lancamentos.js
import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento } = useContext(FinanceContext);
    
    // Estado para controlar item em edição
    const [editingItem, setEditingItem] = useState(null);

    // ... (código de filtros handleFilterChange e useMemo permanece igual) ...
    const [filters, setFilters] = useState({
        tipo: '', categoria: '', dataInicial: '', dataFinal: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredLancamentos = useMemo(() => {
        return lancamentos.filter(item => {
            if (!item) return false;
            if (filters.tipo && item.tipo !== filters.tipo) return false;
            if (filters.categoria && item.categoria !== filters.categoria) return false;
            if (filters.dataInicial && item.data < filters.dataInicial) return false;
            if (filters.dataFinal && item.data > filters.dataFinal) return false;
            return true;
        });
    }, [lancamentos, filters]);

    // Handler para botão editar na tabela
    const handleEdit = (item) => {
        setEditingItem(item);
        // Scroll pro topo ou pro formulário (opcional)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Limpar edição
    const handleClearEdit = () => {
        setEditingItem(null);
    };

    if (loading) {
        return ( /* ... loading spinner ... */ 
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Gestão de Lançamentos</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Adicione, filtre e visualize suas movimentações.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-24">
                        {/* Passamos editingItem e a função de cancelar edição */}
                        <FinanceForm 
                            editingItem={editingItem} 
                            onCancelEdit={handleClearEdit} 
                        />
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                    <Filters filters={filters} onFilterChange={handleFilterChange} />
                    {/* Passamos handleEdit para a tabela */}
                    <Table 
                        data={filteredLancamentos} 
                        onDelete={deleteLancamento} 
                        onEdit={handleEdit} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Lancamentos;