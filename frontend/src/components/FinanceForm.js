import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { FaSave, FaTimes, FaSpinner, FaSearch, FaChevronDown, FaCheckCircle, FaCheck } from 'react-icons/fa';
import { FinanceContext } from '../contexts/FinanceContext';
import { formatCurrency } from '../utils/formatters'; // Importante para o resumo
import Modal from './Modal'; // Importa o novo Modal

// --- FUNÇÃO AUXILIAR DE DATA ---
const getLocalDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- COMPONENTE COMBOBOX (Mantido Igual) ---
const CategoryAutocomplete = ({ value, onChange, suggestions, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const containerRef = useRef(null);

    useEffect(() => { setInputValue(value || ''); }, [value]);

    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange({ target: { name, value: val } });
        setIsOpen(true);
    };

    const handleSelectOption = (suggestion) => {
        setInputValue(suggestion);
        onChange({ target: { name, value: suggestion } });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative z-20 w-full">
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Selecione ou digite"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent outline-none transition-all font-sans shadow-sm"
                    required
                    autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    {isOpen ? <FaChevronDown className="text-sm text-amber-500" /> : <FaSearch className="text-sm" />}
                </div>
            </div>
            {isOpen && filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 animate-fade-in-up">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectOption(suggestion)} className={`px-4 py-3 cursor-pointer text-sm font-sans flex items-center justify-between transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 hover:text-amber-700`}>
                            <span>{suggestion}</span>
                            {inputValue.toLowerCase() === suggestion.toLowerCase() && <FaCheckCircle className="text-amber-600 text-xs" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FinanceForm = ({ editingItem, onCancelEdit }) => {
    const { addLancamento, updateLancamento, notify } = useContext(FinanceContext);
    const CATEGORIES = ['Dízimo', 'Oferta', 'Doação', 'Despesa Fixa', 'Despesa Variável'];

    const getInitialData = () => ({
        tipo: 'Entrada', categoria: '', descricao: '', valor: '', 
        data: getLocalDateString(), formaPagamento: 'Pix', observacoes: '',
    });

    const [formData, setFormData] = useState(getInitialData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- MUDANÇA: Estado para controlar o Modal de Resumo ---
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({ ...editingItem, valor: parseFloat(editingItem.valor).toFixed(2) });
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- MUDANÇA: Lógica real de envio separada ---
    const executeSubmit = async () => {
        setIsSubmitting(true);
        setShowConfirmModal(false); // Fecha o modal se estiver aberto
        try {
            const payload = { ...formData, valor: parseFloat(formData.valor) };
            if (editingItem) {
                await updateLancamento(editingItem.id, payload);
                onCancelEdit();
            } else {
                await addLancamento(payload);
                setFormData(getInitialData());
            }
        } catch (error) {
            // Erro tratado no context
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- MUDANÇA: Intercepta o submit para mostrar o resumo se for NOVO ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Se for edição, envia direto
        if (editingItem) {
            executeSubmit();
            return;
        }

        // Se for novo cadastro, abre o modal de confirmação
        setShowConfirmModal(true);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-lg p-6 md:p-8 rounded-2xl space-y-6">
                <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-serif text-gray-900 font-semibold">
                            {editingItem ? 'Editar' : 'Novo Lançamento'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-sans font-light">
                            {editingItem ? 'Atualize os dados abaixo.' : 'Preencha para adicionar uma nova movimentação.'}
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Descrição */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição <span className="text-red-500">*</span></label>
                        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Ex: Salário mensal" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-sans" />
                    </div>
                    {/* Valor */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$) <span className="text-red-500">*</span></label>
                        <input type="text" name="valor" value={formData.valor} onChange={handleChange} placeholder="0,00" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-mono font-bold" />
                    </div>
                    {/* Data */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data <span className="text-red-500">*</span></label>
                        <input type="date" name="data" value={formData.data} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-sans" />
                    </div>
                    {/* Tipo */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                        <div className="relative">
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 appearance-none focus:ring-2 focus:ring-amber-600 outline-none font-sans">
                                <option value="Entrada">Entrada (+)</option>
                                <option value="Saída">Saída (-)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                        </div>
                    </div>
                    {/* Categoria */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria <span className="text-red-500">*</span></label>
                        <CategoryAutocomplete name="categoria" value={formData.categoria} onChange={handleChange} suggestions={CATEGORIES} />
                    </div>
                    {/* Pagamento */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pagamento</label>
                        <select name="formaPagamento" value={formData.formaPagamento} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-600 outline-none font-sans">
                            <option value="Pix">Pix</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="Transferência">Transferência</option>
                        </select>
                    </div>
                    {/* Obs */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                        <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="2" placeholder="Detalhes adicionais..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-600 outline-none font-sans resize-none"></textarea>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col md:flex-row gap-4 pt-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase py-3.5 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-amber-200">
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {isSubmitting ? 'Salvando...' : (editingItem ? 'Salvar Alterações' : 'Concluir Cadastro')}
                    </button>
                    {editingItem && (
                        <button type="button" onClick={onCancelEdit} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold uppercase py-3.5 rounded-xl transition-colors">
                            <FaTimes /> Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* --- MUDANÇA: Modal de Resumo para Novo Lançamento --- */}
            <Modal 
                isOpen={showConfirmModal} 
                onClose={() => setShowConfirmModal(false)} 
                title="Confirmar Lançamento"
                footer={
                    <>
                        <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">Voltar</button>
                        <button onClick={executeSubmit} className="px-6 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 shadow-md flex items-center gap-2">
                            <FaCheck /> Confirmar
                        </button>
                    </>
                }
            >
                <div className="space-y-3">
                    <p className="text-gray-600 text-sm">Por favor, revise os dados antes de salvar:</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase font-bold">Descrição:</span>
                            <span className="text-gray-900 font-semibold text-sm">{formData.descricao}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase font-bold">Valor:</span>
                            <span className={`font-bold font-mono ${formData.tipo === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>
                                {formData.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(formData.valor)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase font-bold">Categoria:</span>
                            <span className="text-gray-900 text-sm">{formData.categoria}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 text-xs uppercase font-bold">Data:</span>
                            <span className="text-gray-900 text-sm">{formData.data}</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FinanceForm;