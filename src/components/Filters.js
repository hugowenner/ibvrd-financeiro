import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl mb-8 transition-shadow duration-300 hover:shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Tipo</label>
                    <select name="tipo" value={filters.tipo} onChange={onFilterChange} className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans text-sm">
                        <option value="">Todos</option>
                        <option value="Entrada">Entrada</option>
                        <option value="Saída">Saída</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Categoria</label>
                    <select name="categoria" value={filters.categoria} onChange={onFilterChange} className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans text-sm">
                        <option value="">Todas</option>
                        <option value="Dízimo">Dízimo</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Doação">Doação</option>
                        <option value="Evento">Evento</option>
                        <option value="Despesa Fixa">Despesa Fixa</option>
                        <option value="Despesa Variável">Despesa Variável</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Data Inicial</label>
                    <input type="date" name="dataInicial" value={filters.dataInicial} onChange={onFilterChange} className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans text-sm" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Data Final</label>
                    <input type="date" name="dataFinal" value={filters.dataFinal} onChange={onFilterChange} className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans text-sm" />
                </div>
            </div>
        </div>
    );
};

export default Filters;