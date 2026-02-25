import React, { useContext, useState, useMemo, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaTrash, FaUndo, FaExclamationTriangle } from 'react-icons/fa';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';
import Modal from '../../components/Modal'; // Importa o Modal
import { formatCurrency } from '../../utils/formatters'; // Importa para formatar no modal

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento, notification } = useContext(FinanceContext);
    const [editingItem, setEditingItem] = useState(null);

    // --- MUDANÇA: Estado para controlar exclusão ---
    const [deleteTarget, setDeleteTarget] = useState(null); // Armazena o objeto a ser deletado

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

    const handleEdit = (item) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearEdit = () => {
        setEditingItem(null);
    };

    // --- MUDANÇA: Handler que abre o modal, não deleta direto ---
    const handleDeleteRequest = (id) => {
        // Encontra o item completo para mostrar no modal
        const item = lancamentos.find(l => l.id === id);
        if (item) {
            setDeleteTarget(item);
        }
    };

    // --- MUDANÇA: Handler que REALMENTE deleta ---
    const confirmDelete = async () => {
        if (deleteTarget) {
            try {
                await deleteLancamento(deleteTarget.id);
                setDeleteTarget(null); // Fecha o modal
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
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
            
            {/* Toast Notification (Mantido igual) */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 w-full max-w-sm rounded-xl shadow-2xl border transition-all duration-500 ease-out transform translate-y-0 flex flex-col overflow-hidden
                    ${notification.type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}
                `}>
                    <div className="flex items-start p-4">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
                            {notification.type === 'success' ? <FaCheckCircle className="w-5 h-5 text-green-600" /> : <FaExclamationCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className={`text-sm font-medium font-serif ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {notification.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header (Mantido igual) */}
            <header className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-semibold">Gestão de Lançamentos</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-lg">Gerencie suas entradas, saídas e visualize seu saldo atual.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Coluna Esquerda: Formulário */}
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
                    <Filters filters={filters} onFilterChange={handleFilterChange} />

                    {/* --- MUDANÇA: Passa handleDeleteRequest para a Tabela --- */}
                    <Table 
                        data={filteredLancamentos} 
                        onDelete={handleDeleteRequest} 
                        onEdit={handleEdit} 
                    />

                    {filteredLancamentos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-serif text-lg">Nenhum lançamento encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MUDANÇA: Modal de Confirmação de Exclusão --- */}
            <Modal 
                isOpen={!!deleteTarget} 
                onClose={() => setDeleteTarget(null)} 
                title="Excluir Lançamento"
                footer={
                    <>
                        <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancelar</button>
                        <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-md flex items-center gap-2">
                            <FaTrash /> Sim, Excluir
                        </button>
                    </>
                }
            >
                <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-800 font-medium mb-1">Tem certeza que deseja excluir este lançamento?</p>
                        {deleteTarget && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                                <p className="text-sm font-bold text-gray-700">{deleteTarget.descricao}</p>
                                <p className={`text-xs font-mono font-bold ${deleteTarget.tipo === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>
                                    {deleteTarget.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(deleteTarget.valor)}
                                </p>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Lancamentos;