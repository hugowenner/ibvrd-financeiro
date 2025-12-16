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
            setFormData({ // Limpa o formulário
                tipo: 'Entrada', categoria: 'Dízimo', descricao: '', valor: '', data: new Date().toISOString().split('T')[0], formaPagamento: 'Pix', observacoes: ''
            });
        } catch (error) {
            alert('Ocorreu um erro ao adicionar o lançamento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
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
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                    <input type="number" name="valor" value={formData.valor} onChange={handleChange} step="0.01" min="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data</label>
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-azul-ibvrd text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400">
                {isSubmitting ? 'Adicionando...' : 'Adicionar Lançamento'}
            </button>
        </form>
    );
};

export default FinanceForm;