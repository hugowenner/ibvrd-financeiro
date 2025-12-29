import React, { useState } from 'react';
import { useContext } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';

const FinanceForm = () => {
    const { addLancamento } = useContext(FinanceContext);
    const [formData, setFormData] = useState({
        tipo: 'Entrada',
        categoria: 'Dízimo',
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        formaPagamento: 'Pix',
        observacoes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addLancamento({ ...formData, valor: parseFloat(formData.valor) });
            alert('Lançamento adicionado com sucesso!');
            setFormData({
                tipo: 'Entrada', categoria: 'Dízimo', descricao: '', valor: '', data: new Date().toISOString().split('T')[0], formaPagamento: 'Pix', observacoes: ''
            });
        } catch (error) {
            alert('Ocorreu um erro ao adicionar o lançamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm p-8 rounded-lg space-y-6">
            <div className="border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-xl font-serif text-gray-900 font-medium">Novo Lançamento</h3>
                <div className="w-12 h-0.5 bg-amber-600 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200">
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
                    <select name="categoria" value={formData.categoria} onChange={handleChange} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200">
                        <option value="Dízimo">Dízimo</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Doação">Doação</option>
                        <option value="Evento">Evento</option>
                        <option value="Despesa Fixa">Despesa Fixa</option>
                        <option value="Despesa Variável">Despesa Variável</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descrição</label>
                <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200" placeholder="Ex: Dízimo de Janeiro" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Valor (R$)</label>
                    <input type="number" name="valor" value={formData.valor} onChange={handleChange} step="0.01" min="0.01" required className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 font-mono" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Data</label>
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Forma de Pagamento</label>
                <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200">
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observações</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="2" className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600 transition duration-200 resize-none"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white font-bold uppercase tracking-widest text-sm py-3 px-4 rounded-md hover:bg-amber-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow">
                {isSubmitting ? 'Adicionando...' : 'Adicionar Lançamento'}
            </button>
        </form>
    );
};

export default FinanceForm;