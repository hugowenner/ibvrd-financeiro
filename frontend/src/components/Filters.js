import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCalendar, FaChevronDown, FaCheckCircle } from 'react-icons/fa';
// --- NOVO COMPONENTE: ComboBox Personalizado (Versão Filtro) ---
const CategoryAutocomplete = ({ value, onChange, suggestions, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const containerRef = useRef(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Filtro inteligente
    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

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
        setIsOpen(true);
    };

    const handleSelectOption = (suggestion) => {
        setInputValue(suggestion);
        onChange({ target: { name, value: suggestion } });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative z-20 w-full">
            {/* Input com Ícone */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    {isOpen ? <FaChevronDown className="text-sm text-amber-500" /> : <FaSearch className="text-sm" />}
                </div>
                <input 
                    type="text" 
                    name={name} 
                    value={inputValue} 
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Buscar..." 
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none font-sans shadow-sm transition-all"
                    autoComplete="off"
                />
            </div>

            {/* Dropdown de Sugestões */}
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
// ---------------------------------------------------------------

const Filters = ({ filters, onFilterChange }) => {
    // Lista de categorias para o autocomplete
    const CATEGORIES = ['Dízimo', 'Oferta', 'Doação', 'Despesa Fixa', 'Despesa Variável'];

    const handleClear = () => {
        // Reseta todos os filtros
        const events = ['tipo', 'categoria', 'dataInicial', 'dataFinal'].map(name => 
            ({ target: { name, value: '' } })
        );
        events.forEach(e => onFilterChange(e));
    };

    return (
        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-serif text-gray-900 font-semibold flex items-center gap-2">
                    <FaFilter className="text-amber-600 text-sm" /> Filtros
                </h3>
                <button onClick={handleClear} className="text-xs font-bold text-gray-400 hover:text-amber-600 uppercase tracking-wider flex items-center gap-1 transition-colors">
                    <FaTimes /> Limpar Tudo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tipo */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo</label>
                    <div className="relative">
                        <select name="tipo" value={filters.tipo} onChange={onFilterChange} className="block w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none font-sans appearance-none shadow-sm">
                            <option value="">Todos</option>
                            <option value="Entrada">Entrada</option>
                            <option value="Saída">Saída</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <FaFilter className="text-xs" />
                        </div>
                    </div>
                </div>

                {/* CATEGORIA MELHORADA */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Categoria</label>
                    <CategoryAutocomplete 
                        name="categoria" 
                        value={filters.categoria} 
                        onChange={onFilterChange} 
                        suggestions={CATEGORIES}
                    />
                </div>

                {/* Data Inicial */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">De</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FaCalendar className="text-sm" />
                        </div>
                        <input type="date" name="dataInicial" value={filters.dataInicial} onChange={onFilterChange} className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none font-sans shadow-sm" />
                    </div>
                </div>

                {/* Data Final */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Até</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FaCalendar className="text-sm" />
                        </div>
                        <input type="date" name="dataFinal" value={filters.dataFinal} onChange={onFilterChange} className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-600 focus:bg-white outline-none font-sans shadow-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;