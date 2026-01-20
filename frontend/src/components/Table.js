import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

// Recebe a função onDelete via props
const Table = ({ data, onDelete }) => {
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
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest font-sans text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                {/* colSpan atualizado para 5 pois agora temos 5 colunas */}
                                <td colSpan="5" className="py-8 text-center text-gray-400 font-serif text-sm">Nenhum registro encontrado.</td>
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
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => {
                                                if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
                                                    onDelete(row.id);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                                            title="Excluir Lançamento"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
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