import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

const Table = ({ data }) => {
    return (
        <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Data</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Descrição</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">Categoria</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest font-sans text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-400 font-serif text-sm">Nenhum registro encontrado.</td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="hover:bg-amber-50 transition-colors duration-200 group">
                                    <td className="py-4 px-6 text-sm text-gray-600 font-sans font-medium">{formatDate(row.data)}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-serif font-medium group-hover:text-amber-800 transition-colors">{row.descricao}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 font-sans">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full tracking-wide">
                                            {row.categoria}
                                        </span>
                                    </td>
                                    <td className={`py-4 px-6 text-sm font-bold font-mono text-right ${row.tipo === 'Entrada' ? 'text-green-700' : 'text-red-600'}`}>
                                        {row.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(row.valor)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;