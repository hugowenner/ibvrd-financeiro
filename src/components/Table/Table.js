import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Table = ({ data }) => {
    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-serif">Data</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-serif">Descrição</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-serif">Categoria</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-serif text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-amber-50 transition-colors duration-200">
                                <td className="py-4 px-6 text-sm text-gray-600 font-light">{formatDate(row.data)}</td>
                                <td className="py-4 px-6 text-sm text-gray-900 font-medium">{row.descricao}</td>
                                <td className="py-4 px-6 text-sm text-gray-600 font-light">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                        {row.categoria}
                                    </span>
                                </td>
                                <td className={`py-4 px-6 text-sm font-semibold font-mono text-right ${row.tipo === 'Entrada' ? 'text-green-700' : 'text-red-700'}`}>
                                    {row.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(row.valor)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;