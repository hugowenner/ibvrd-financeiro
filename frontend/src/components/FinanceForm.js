// src/components/FinanceForm.js
import React, { useState } from 'react';
import { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

const FinanceForm = () => {
    const { addLancamento, notify } = useContext(FinanceContext);
    
    // ALTERAÇÃO: Inicializa o valor como string '0.00'
    const [formData, setFormData] = useState({
        tipo: 'Entrada',
        categoria: 'Dízimo',
        descricao: '',
        valor: '0.00', 
        data: new Date().toISOString().split('T')[0],
        formaPagamento: 'Pix',
        observacoes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Lógica Especial para MÁSCARA DE MOEDA (Digitação em tempo real)
        if (name === 'valor') {
            // 1. Remove tudo que não é dígito (pontos, vírgulas, letras)
            let valorNumerico = value.replace(/\D/g, '');

            // 2. Se estiver vazio, deixa vazio (o blur vai colocar 0.00 depois)
            if (valorNumerico === '') {
                setFormData(prev => ({ ...prev, valor: '' }));
                return;
            }

            // 3. Converte para número (divide por 100 para transformar centavos em reais)
            // Exemplo: usuário digita "100" -> vira "1.00"
            //          usuário digita "1050" -> vira "10.50"
            let valorFormatado = (parseInt(valorNumerico) / 100).toFixed(2);

            setFormData(prev => ({ ...prev, valor: valorFormatado }));
        } else {
            // Para os outros campos, comportamento normal
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handler para garantir que, ao sair do campo vazio, fique 0.00
    const handleValorBlur = (e) => {
        if (!e.target.value || e.target.value === '0.00') {
            setFormData(prev => ({ ...prev, valor: '0.00' }));
        }
    };

    // Handler para selecionar tudo ao clicar
    const handleValorFocus = (e) => {
        e.target.select();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Converte a string formatada '0.00' para float antes de enviar
            await addLancamento({ 
                ...formData, 
                valor: parseFloat(formData.valor) 
            });
            notify('Lançamento adicionado com sucesso!', 'success');
            
            // Reseta o form (Valor volta para 0.00)
            setFormData({
                tipo: 'Entrada', 
                categoria: 'Dízimo', 
                descricao: '', 
                valor: '0.00', 
                data: new Date().toISOString().split('T')[0], 
                formaPagamento: 'Pix', 
                observacoes: ''
            });
        } catch (error) {
            notify('Ocorreu um erro ao adicionar o lançamento.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-lg p-4 md:p-8 rounded-2xl space-y-6 h-fit">
            <div className="border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-xl md:text-2xl font-serif text-gray-900 font-semibold">Novo Lançamento</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-sans">Registre uma nova movimentação.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans min-h-[44px]">
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Categoria</label>
                    <select name="categoria" value={formData.categoria} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans min-h-[44px]">
                        <option value="Dízimo">Dízimo</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Doação">Doação</option>
                        <option value="Evento">Evento</option>
                        <option value="Despesa Fixa">Despesa Fixa</option>
                        <option value="Despesa Variável">Despesa Variável</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Descrição</label>
                <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans min-h-[44px]" placeholder="Ex: Dízimo de Janeiro" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Valor (R$)</label>
                    <input 
                        type="text" 
                        inputMode="decimal" 
                        name="valor" 
                        value={formData.valor} 
                        onChange={handleChange} // A mágica acontece aqui
                        onBlur={handleValorBlur} 
                        onFocus={handleValorFocus} 
                        required 
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-mono min-h-[44px]" 
                        placeholder="0.00" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Data</label>
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans min-h-[44px]" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Forma de Pagamento</label>
                <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans min-h-[44px]">
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cartão">Cartão</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Observações</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="2" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 resize-none font-sans min-h-[80px]"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 text-white font-bold uppercase tracking-widest text-xs py-4 px-4 rounded-xl hover:bg-amber-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg min-h-[48px]">
                {isSubmitting ? 'Processando...' : 'Concluir Cadastro'}
            </button>
        </form>
    );
};

export default FinanceForm;