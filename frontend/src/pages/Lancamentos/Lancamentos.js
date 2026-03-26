import React, { useContext, useState, useMemo } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { FinanceContext } from '../../contexts/FinanceContext';
import FinanceForm from '../../components/FinanceForm';
import Filters from '../../components/Filters';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/formatters';

// 🔥 IMPORT CORRETO (TOPO DO ARQUIVO)
import { parseDateSafe } from '../../utils/date';

const Lancamentos = () => {
    const { lancamentos, loading, deleteLancamento, notification } = useContext(FinanceContext);

    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [filters, setFilters] = useState({
        tipo: '',
        categoria: '',
        dataInicial: '',
        dataFinal: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // 🔥 FILTRO CORRIGIDO (SEM STRING BUG)
    const filteredLancamentos = useMemo(() => {
        return lancamentos.filter(item => {
            if (!item) return false;

            if (filters.tipo && item.tipo !== filters.tipo) return false;
            if (filters.categoria && item.categoria !== filters.categoria) return false;

            if (filters.dataInicial) {
                const itemDate = parseDateSafe(item.data);
                const start = parseDateSafe(filters.dataInicial);
                if (itemDate < start) return false;
            }

            if (filters.dataFinal) {
                const itemDate = parseDateSafe(item.data);
                const end = parseDateSafe(filters.dataFinal);
                if (itemDate > end) return false;
            }

            return true;
        });
    }, [lancamentos, filters]);

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleClearEdit = () => {
        setEditingItem(null);
    };

    const handleDeleteRequest = (id) => {
        const item = lancamentos.find(l => l.id === id);
        if (item) setDeleteTarget(item);
    };

    const confirmDelete = async () => {
        if (deleteTarget) {
            try {
                await deleteLancamento(deleteTarget.id);
                setDeleteTarget(null);
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-amber-600" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-10">

            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-white border rounded-xl shadow p-4">
                    <p>{notification.message}</p>
                </div>
            )}

            <header className="mb-8 pb-6 border-b">
                <h2 className="text-3xl font-serif font-semibold">Gestão de Lançamentos</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-4">
                    <FinanceForm 
                        editingItem={editingItem}
                        onCancelEdit={handleClearEdit}
                    />
                </div>

                <div className="lg:col-span-8 space-y-8">

                    <Filters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />

                    <Table
                        data={filteredLancamentos}
                        onDelete={handleDeleteRequest}
                        onEdit={handleEdit}
                    />

                    {filteredLancamentos.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            Nenhum lançamento encontrado
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Excluir Lançamento"
                footer={
                    <>
                        <button onClick={() => setDeleteTarget(null)}>Cancelar</button>
                        <button onClick={confirmDelete}>Excluir</button>
                    </>
                }
            >
                {deleteTarget && (
                    <div>
                        <p>{deleteTarget.descricao}</p>
                        <p>
                            {formatCurrency(deleteTarget.valor)}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Lancamentos;