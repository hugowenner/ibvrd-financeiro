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
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Relatórios Financeiros</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card title="Resumo Mensal" className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left border-b">
                            <tr>
                                <th className="pb-2 font-semibold text-gray-700">Mês</th>
                                <th className="pb-2 font-semibold text-positivo text-right">Entradas</th>
                                <th className="pb-2 font-semibold text-negativo text-right">Saídas</th>
                                <th className="pb-2 font-semibold text-gray-800 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorioMensal.map((rel, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">{rel.mes}</td>
                                    <td className="py-2 text-right text-positivo">{formatCurrency(rel.entradas)}</td>
                                    <td className="py-2 text-right text-negativo">{formatCurrency(rel.saidas)}</td>
                                    <td className={`py-2 text-right font-semibold ${rel.saldo >= 0 ? 'text-positivo' : 'text-negativo'}`}>{formatCurrency(rel.saldo)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card title="Total por Categoria" className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left border-b">
                            <tr>
                                <th className="pb-2 font-semibold text-gray-700">Categoria</th>
                                <th className="pb-2 font-semibold text-gray-800 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatorioPorCategoria.map((rel, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">{rel.categoria}</td>
                                    <td className="py-2 text-right font-semibold">{formatCurrency(rel.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

export default Relatorios;