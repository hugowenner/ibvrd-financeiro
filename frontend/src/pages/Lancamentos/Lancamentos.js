import React, { useContext, useState, useMemo, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento, notification } = useContext(FinanceContext);
    const [editingItem, setEditingItem] = useState(null);

    // Filtros
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

    // Handler para edição com scroll suave
    const handleEdit = (item) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearEdit = () => {
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen-minus-nav space-y-4 animate-fade-in">
                <FaSpinner className="animate-spin text-4xl text-amber-600" />
                <p className="text-gray-500 font-sans font-light">Carregando seus dados...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-10 animate-fade-in">
            
            {/* TOAST NOTIFICATION (Feedback Visual Global) */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 ${notification.type === 'success' ? 'bg-white border-green-200 text-green-800' : 'bg-white border-red-200 text-red-800'}`}>
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-opacity-20">
                        {notification.type === 'success' ? (
                            <FaCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <FaExclamationCircle className="w-5 h-5 text-red-600" />
                        )}
                    </div>
                    <div className="ml-3 text-sm font-sans font-medium">{notification.message}</div>
                </div>
            )}

            {/* Header */}
            <header className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-semibold">Gestão de Lançamentos</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-lg">Gerencie suas entradas, saídas e visualize seu saldo atual.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Coluna Esquerda: Formulário (Sticky) */}
                <div className="lg:col-span-4 xl:col-span-3 w-full">
                    <div className="sticky top-24 space-y-6">
                        <FinanceForm 
                            editingItem={editingItem} 
                            onCancelEdit={handleClearEdit} 
                        />
                    </div>
                </div>

                {/* Coluna Direita: Conteúdo */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                    
                    {/* Filtros */}
                    <Filters filters={filters} onFilterChange={handleFilterChange} />

                    {/* Tabela */}
                    <Table 
                        data={filteredLancamentos} 
                        onDelete={deleteLancamento} 
                        onEdit={handleEdit} 
                    />

                    {/* Estado Vazio */}
                    {filteredLancamentos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-serif text-lg">Nenhum lançamento encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lancamentos;