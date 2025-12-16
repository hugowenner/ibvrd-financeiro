import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Table = ({ data }) => {
    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
                <thead className="bg-azul-ibvrd text-white">
                    <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Data</th>
                        <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Descrição</th>
                        <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Categoria</th>
                        <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Valor</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm text-gray-700">{formatDate(row.data)}</td>
                            <td className="py-4 px-4 text-sm text-gray-700">{row.descricao}</td>
                            <td className="py-4 px-4 text-sm text-gray-700">{row.categoria}</td>
                            <td className={`py-4 px-4 text-sm font-semibold ${row.tipo === 'Entrada' ? 'text-positivo' : 'text-negativo'}`}>
                                {row.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(row.valor)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;