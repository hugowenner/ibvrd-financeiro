import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card/Card';
import { formatCurrency } from '../../utils/formatters';

const Relatorios = () => {
    const { lancamentos, loading } = useContext(FinanceContext);

    const relatorioMensal = useMemo(() => {
        const agrupado = lancamentos.reduce((acc, lancamento) => {
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
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-serif text-gray-900 font-normal">Relatórios Financeiros</h2>
                <p className="text-gray-500 mt-2 font-light">Análise detalhada por período e categoria.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card Resumo Mensal */}
                <Card title="Resumo Mensal" className="border-t-4 border-t-amber-600">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-bold tracking-wider">Mês</th>
                                    <th className="px-4 py-3 font-bold tracking-wider text-right">Entradas</th>
                                    <th className="px-4 py-3 font-bold tracking-wider text-right">Saídas</th>
                                    <th className="px-4 py-3 font-bold tracking-wider text-right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {relatorioMensal.map((rel, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-700 capitalize">{rel.mes}</td>
                                        <td className="px-4 py-3 text-right text-green-700 font-mono">{formatCurrency(rel.entradas)}</td>
                                        <td className="px-4 py-3 text-right text-red-700 font-mono">{formatCurrency(rel.saidas)}</td>
                                        <td className={`px-4 py-3 text-right font-bold font-serif ${rel.saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(rel.saldo)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Card Total por Categoria */}
                <Card title="Total por Categoria" className="border-t-4 border-t-amber-600">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-bold tracking-wider">Categoria</th>
                                    <th className="px-4 py-3 font-bold tracking-wider text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {relatorioPorCategoria.map((rel, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-700">{rel.categoria}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-900 font-mono">{formatCurrency(rel.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Relatorios;