import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { FaSave, FaTimes, FaSpinner, FaSearch, FaChevronDown, FaCheckCircle } from 'react-icons/fa';
import { FinanceContext } from '../contexts/FinanceContext';

// --- NOVO COMPONENTE: ComboBox Personalizado ---
// Permite digitar livremente ou selecionar da lista com estilização total
const CategoryAutocomplete = ({ value, onChange, suggestions, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const containerRef = useRef(null);

    // Sincroniza com o estado externo (caso o form seja limpo ou carregado com edição)
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Filtra as sugestões baseado no que foi digitado
    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        onChange({ target: { name, value: val } });
        setIsOpen(true); // Abre a lista enquanto digita
    };

    const handleSelectOption = (suggestion) => {
        setInputValue(suggestion);
        onChange({ target: { name, value: suggestion } });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative z-20 w-full">
            {/* Input Estilizado */}
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)} // Abre ao focar
                    placeholder="Selecione ou digite"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent outline-none transition-all font-sans shadow-sm"
                    required
                    autoComplete="off" // Evita histórico do navegador conflitar
                />
                {/* Ícone Dinâmico: Lupa ou Seta */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    {isOpen ? <FaChevronDown className="text-sm text-amber-500" /> : <FaSearch className="text-sm" />}
                </div>
            </div>

            {/* Lista Suspensa (Dropdown) Estilizada */}
            {isOpen && filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 animate-fade-in-up">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectOption(suggestion)}
                            className={`px-4 py-3 cursor-pointer text-sm font-sans flex items-center justify-between transition-colors 
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 hover:text-amber-700`}
                        >
                            <span>{suggestion}</span>
                            {inputValue.toLowerCase() === suggestion.toLowerCase() && (
                                <FaCheckCircle className="text-amber-600 text-xs" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
// -----------------------------------------------

const FinanceForm = ({ editingItem, onCancelEdit }) => {
    const { addLancamento, updateLancamento, notify } = useContext(FinanceContext);
    
    // Lista de categorias
    const CATEGORIES = ['Dízimo', 'Oferta', 'Doação', 'Despesa Fixa', 'Despesa Variável'];

    const getInitialData = () => ({
        tipo: 'Entrada', categoria: '', descricao: '', valor: '', 
        data: new Date().toISOString().split('T')[0], formaPagamento: 'Pix', observacoes: '',
    });

    const [formData, setFormData] = useState(getInitialData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                ...editingItem,
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
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

    return (
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
                    <input
                        type="text" name="descricao" value={formData.descricao} onChange={handleChange}
                        placeholder="Ex: Salário mensal" required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-sans"
                    />
                </div>

                {/* Valor */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$) <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="valor" value={formData.valor} onChange={handleChange}
                        placeholder="0,00" required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-mono font-bold"
                    />
                </div>

                {/* Data */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data <span className="text-red-500">*</span></label>
                    <input
                        type="date" name="data" value={formData.data} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all font-sans"
                    />
                </div>

                {/* Tipo */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                    <div className="relative">
                        <select name="tipo" value={formData.tipo} onChange={handleChange} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 appearance-none focus:ring-2 focus:ring-amber-600 outline-none font-sans">
                            <option value="Entrada">Entrada (+)</option>
                            <option value="Saída">Saída (-)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {/* CATEGORIA MELHORADA (Custom ComboBox) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria <span className="text-red-500">*</span></label>
                    <CategoryAutocomplete 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange} 
                        suggestions={CATEGORIES}
                    />
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
                    <textarea
                        name="observacoes" value={formData.observacoes} onChange={handleChange}
                        rows="2" placeholder="Detalhes adicionais..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-600 outline-none font-sans resize-none"
                    ></textarea>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">
                <button
                    type="submit" disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase py-3.5 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-amber-200"
                >
                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {isSubmitting ? 'Salvando...' : (editingItem ? 'Salvar Alterações' : 'Concluir Cadastro')}
                </button>

                {editingItem && (
                    <button
                        type="button" onClick={onCancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold uppercase py-3.5 rounded-xl transition-colors"
                    >
                        <FaTimes /> Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default FinanceForm;