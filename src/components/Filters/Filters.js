import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select name="tipo" value={filters.tipo} onChange={onFilterChange} className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
                    <option value="">Todos</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select name="categoria" value={filters.categoria} onChange={onFilterChange} className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm">
                    <option value="">Todas</option>
                    <option value="Dízimo">Dízimo</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Doação">Doação</option>
                    <option value="Evento">Evento</option>
                    <option value="Despesa Fixa">Despesa Fixa</option>
                    <option value="Despesa Variável">Despesa Variável</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
                <input type="date" name="dataInicial" value={filters.dataInicial} onChange={onFilterChange} className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Data Final</label>
                <input type="date" name="dataFinal" value={filters.dataFinal} onChange={onFilterChange} className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul-ibvrd focus:border-azul-ibvrd sm:text-sm" />
            </div>
        </div>
    );
};

export default Filters;