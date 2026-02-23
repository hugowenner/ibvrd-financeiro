// src/components/FinanceForm.js
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

const FinanceForm = ({ editingItem, onCancelEdit }) => {
    const { addLancamento, updateLancamento, notify } = useContext(FinanceContext);
    
    const getInitialData = () => ({
        tipo: 'Entrada', categoria: 'Dízimo', descricao: '', valor: '0.00', 
        data: new Date().toISOString().split('T')[0], formaPagamento: 'Pix', observacoes: '',
    });

    const [formData, setFormData] = useState(getInitialData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // EFEITO: Quando editingItem muda (vindo da página), preenche o form
    useEffect(() => {
        if (editingItem) {
            setFormData({
                ...editingItem,
                // Garante que o valor seja string formatada para o input
                valor: parseFloat(editingItem.valor).toFixed(2) 
            });
        } else {
            setFormData(getInitialData());
        }
    }, [editingItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'valor') {
            let valorNumerico = value.replace(/\D/g, '');
            if (valorNumerico === '') { setFormData(prev => ({ ...prev, valor: '' })); return; }
            let valorFormatado = (parseInt(valorNumerico) / 100).toFixed(2);
            setFormData(prev => ({ ...prev, valor: valorFormatado }));
            return;
        }

        if (name === 'categoria') {
            let novoTipo = 'Entrada';
            if (value === 'Despesa Fixa' || value === 'Despesa Variável') novoTipo = 'Saída';
            setFormData(prev => ({ ...prev, categoria: value, tipo: novoTipo }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData, valor: parseFloat(formData.valor) };
            
            if (editingItem) {
                // MODO EDIÇÃO
                await updateLancamento(editingItem.id, payload);
                onCancelEdit(); // Limpa o modo edição
            } else {
                // MODO CRIAÇÃO
                await addLancamento(payload);
                setFormData(getInitialData()); // Limpa form
            }
        } catch (error) {
            // Erro já tratado no context via notify
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-lg p-4 md:p-8 rounded-2xl space-y-6 h-fit">
            <div className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 font-semibold">
                        {editingItem ? 'Editar Lançamento' : 'Novo Lançamento'}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 font-sans">
                        {editingItem ? 'Altere os dados abaixo.' : 'Registre uma nova movimentação.'}
                    </p>
                </div>
                {editingItem && (
                    <button type="button" onClick={onCancelEdit} className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-wider">
                        Cancelar
                    </button>
                )}
            </div>
            
            {/* O resto do JSX do form permanece igual, apenas garantindo value={formData.campo} */}
            {/* ... Inputs ... */}
            
            {/* Exemplo abreviado dos inputs para economizar espaço, copie do original */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>
                {/* ... Repita os outros inputs (Categoria, Descrição, Valor, Data, Pagamento, Obs) ... */}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white font-bold uppercase py-4 rounded-xl hover:bg-amber-700 disabled:bg-gray-300">
                {isSubmitting ? 'Salvando...' : (editingItem ? 'Salvar Alterações' : 'Concluir Cadastro')}
            </button>
        </form>
    );
};

export default FinanceForm;