// src/pages/Relatorios/Relatorios.js
import React, { useContext, useMemo } from 'react';
// CORREÇÃO AQUI: Mudei de '../contexts/' para '../../contexts/'
import { FinanceContext } from '../../contexts/FinanceContext'; 
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/formatters';

const Relatorios = () => {
    const { lancamentos, loading } = useContext(FinanceContext);

    const relatorioMensal = useMemo(() => {
        const agrupado = lancamentos.reduce((acc, lancamento) => {
            if (!lancamento) return acc; // Segurança contra undefined

            const mesAno = lancamento.data.substring(0, 7); // YYYY-MM
            if (!acc[mesAno]) {
                acc[mesAno] = { entradas: 0, saidas: 0 };
            }
            if (lancamento.tipo === 'Entrada') {
                acc[mesAno].entradas += lancamento.valor;
            } else {
                acc[mesAno].saidas += lancamento.valor;
            }
            return acc;
        }, {});

        return Object.entries(agrupado).map(([mesAno, valores]) => ({
            mes: new Date(mesAno + '-01').toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
            ...valores,
            saldo: valores.entradas - valores.saidas
        })).sort((a, b) => b.mes.localeCompare(a.mes));
    }, [lancamentos]);

    const relatorioPorCategoria = useMemo(() => {
        const agrupado = lancamentos.reduce((acc, lancamento) => {
            if (!lancamento) return acc; // Segurança contra undefined

            if (!acc[lancamento.categoria]) {
                acc[lancamento.categoria] = 0;
            }
            acc[lancamento.categoria] += lancamento.valor;
            return acc;
        }, {});
        
        return Object.entries(agrupado).map(([categoria, total]) => ({
            categoria,
            total
        })).sort((a, b) => b.total - a.total);
    }, [lancamentos]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6 md:mb-10 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Relatórios Financeiros</h2>
                <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Análise detalhada por período e categoria.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Card Resumo Mensal */}
                <Card title="Resumo Mensal" className="border-t-4 border-t-amber-600">
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                        <div className="px-4 md:px-0">
                            <table className="w-full text-sm text-left min-w-[500px]">
                                <thead className="text-[10px] md:text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest font-sans">Mês</th>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest text-right font-sans">Entradas</th>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest text-right font-sans">Saídas</th>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest text-right font-sans">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {relatorioMensal.map((rel, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 md:px-4 py-3 font-medium text-gray-700 capitalize font-serif">{rel.mes}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-green-700 font-mono">{formatCurrency(rel.entradas)}</td>
                                            <td className="px-3 md:px-4 py-3 text-right text-red-700 font-mono">{formatCurrency(rel.saidas)}</td>
                                            <td className={`px-3 md:px-4 py-3 text-right font-bold font-serif ${rel.saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(rel.saldo)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                {/* Card Total por Categoria */}
                <Card title="Total por Categoria" className="border-t-4 border-t-amber-600">
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                        <div className="px-4 md:px-0">
                            <table className="w-full text-sm text-left min-w-[400px]">
                                <thead className="text-[10px] md:text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest font-sans">Categoria</th>
                                        <th className="px-3 md:px-4 py-3 font-bold tracking-widest text-right font-sans">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {relatorioPorCategoria.map((rel, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-3 md:px-4 py-3 font-medium text-gray-700 font-serif">{rel.categoria}</td>
                                            <td className="px-3 md:px-4 py-3 text-right font-bold text-gray-900 font-mono">{formatCurrency(rel.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Relatorios;