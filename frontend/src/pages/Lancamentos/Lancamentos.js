import React, { useContext, useState, useMemo, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaTrash, FaUndo } from 'react-icons/fa';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento, notification, undoDelete } = useContext(FinanceContext);
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

    // Handler para fechar o toast manualmente
    const closeNotification = () => {
        // Implementação simples: apenas remove do contexto se o contexto permitir setar null.
        // Aqui vamos simular criando um estado local ou podemos passar uma função no Context.
        // Para simplificar e manter a arquitetura, deixamos o auto-dismiss do Context cuidar.
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
            
            {/* SISTEMA AVANÇADO DE NOTIFICAÇÃO (TOAST) */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 w-full max-w-sm rounded-xl shadow-2xl border transition-all duration-500 ease-out transform translate-y-0 flex flex-col overflow-hidden
                    ${notification.type === 'success' 
                        ? 'bg-white border-green-200' 
                        : notification.type === 'delete' 
                        ? 'bg-white border-red-200' 
                        : 'bg-white border-red-200'}
                `}>
                    <div className="flex items-start p-4">
                        {/* Ícone */}
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
                            {notification.type === 'success' ? (
                                <FaCheckCircle className="w-5 h-5 text-green-600" />
                            ) : notification.type === 'delete' ? (
                                <FaTrash className="w-5 h-5 text-red-500" />
                            ) : (
                                <FaExclamationCircle className="w-5 h-5 text-red-600" />
                            )}
                        </div>

                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className={`text-sm font-medium font-serif ${
                                notification.type === 'success' ? 'text-green-800' : 
                                notification.type === 'delete' ? 'text-red-800' : 'text-red-800'
                            }`}>
                                {notification.message}
                            </p>
                        </div>

                        {/* Botão de Desfazer (Apenas para tipo 'delete') */}
                        {notification.type === 'delete' && (
                            <div className="ml-4 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        undoDelete();
                                        // O contexto cuidará de limpar a notificação automaticamente ao desfazer
                                    }}
                                    className="bg-white border border-gray-200 rounded-md py-1.5 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <FaUndo className="text-xs" /> Desfazer
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Barra de Progresso (Timer) */}
                    {notification.type === 'delete' && (
                        <div className="w-full bg-red-100 h-1">
                            <div className="bg-red-500 h-1 w-full animate-[shrink-width_5s_linear]"></div>
                        </div>
                    )}
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