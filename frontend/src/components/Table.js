import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../utils/formatters';

const Table = ({ data, onDelete, onEdit }) => {
    return (
        <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Valor</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-gray-400 font-sans italic">Nenhum registro encontrado.</td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr 
                                    key={row.id} 
                                    className={`transition-all duration-200 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-amber-50`}
                                >
                                    <td className="py-4 px-6 text-sm text-gray-600 font-medium whitespace-nowrap">
                                        {formatDate(row.data)}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-semibold">
                                        {row.descricao}
                                        {row.observacoes && (
                                            <div className="text-xs text-gray-400 font-normal mt-1 truncate max-w-[200px]" title={row.observacoes}>
                                                {row.observacoes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            {row.categoria}
                                        </span>
                                    </td>
                                    <td className={`py-4 px-6 text-sm font-bold text-right font-mono ${row.tipo === 'Entrada' ? 'text-green-600' : 'text-red-500'}`}>
                                        {row.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(row.valor)}
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {/* Botão Editar */}
                                            <button 
                                                onClick={() => onEdit(row)}
                                                className="p-2 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                                                title="Editar"
                                            >
                                                <FaPencilAlt className="text-sm" />
                                            </button>
                                            
                                            {/* Botão Excluir - Agora remove direto (Undo via Toast) */}
                                            <button 
                                                onClick={() => onDelete(row.id)}
                                                className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                                                title="Excluir"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
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