import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/formatters';
import { FaPrint } from 'react-icons/fa';
import { normalizeDateString } from '../../utils/date';

const Relatorios = () => {
    const { lancamentos, loading } = useContext(FinanceContext);
    const [selectedMonth, setSelectedMonth] = useState('');

    const safeParseFloat = (value) => {
        if (!value) return 0;
        let str = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
        const parsed = parseFloat(str);
        return isNaN(parsed) ? 0 : parsed;
    };

    // =========================
    // FILTRO GLOBAL
    // =========================
    const lancamentosFiltrados = useMemo(() => {
        return lancamentos.filter(l => {
            if (!l?.data) return false;

            const data = normalizeDateString(l.data);

            if (selectedMonth && !data.startsWith(selectedMonth)) {
                return false;
            }

            return true;
        });
    }, [lancamentos, selectedMonth]);

    // =========================
    // TOTAIS GERAIS (NOVO)
    // =========================
    const totalEntradas = lancamentosFiltrados
        .filter(l => l.tipo === 'Entrada')
        .reduce((acc, l) => acc + safeParseFloat(l.valor), 0);

    const totalSaidas = lancamentosFiltrados
        .filter(l => l.tipo !== 'Entrada')
        .reduce((acc, l) => acc + safeParseFloat(l.valor), 0);

    const saldoTotal = totalEntradas - totalSaidas;

    // =========================
    // MESES DISPONÍVEIS
    // =========================
    const mesesDisponiveis = useMemo(() => {
        const meses = new Set();

        lancamentos.forEach(l => {
            if (!l?.data) return;

            const data = normalizeDateString(l.data);
            meses.add(data.substring(0, 7));
        });

        return Array.from(meses).sort((a, b) => b.localeCompare(a));
    }, [lancamentos]);

    // =========================
    // RELATÓRIO MENSAL
    // =========================
    const relatorioMensal = useMemo(() => {
        const agrupado = {};

        lancamentosFiltrados.forEach(l => {
            if (!l?.data) return;

            const data = normalizeDateString(l.data);
            const mesAno = data.substring(0, 7);

            if (!agrupado[mesAno]) {
                agrupado[mesAno] = { entradas: 0, saidas: 0 };
            }

            const valor = safeParseFloat(l.valor);

            if (l.tipo === 'Entrada') {
                agrupado[mesAno].entradas += valor;
            } else {
                agrupado[mesAno].saidas += valor;
            }
        });

        return Object.entries(agrupado).map(([mesAno, valores]) => {
            const [year, month] = mesAno.split('-').map(Number);

            const date = new Date(Date.UTC(year, month - 1));

            return {
                mes: date.toLocaleString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC'
                }),
                original: mesAno,
                ...valores,
                saldo: valores.entradas - valores.saidas
            };
        }).sort((a, b) => b.original.localeCompare(a.original));

    }, [lancamentosFiltrados]);

    // =========================
    // CATEGORIAS
    // =========================
    const relatorioPorCategoria = useMemo(() => {
        const agrupado = {};

        lancamentosFiltrados.forEach(l => {
            if (!l?.categoria) return;

            if (!agrupado[l.categoria]) {
                agrupado[l.categoria] = 0;
            }

            agrupado[l.categoria] += safeParseFloat(l.valor);
        });

        return Object.entries(agrupado)
            .map(([categoria, total]) => ({ categoria, total }))
            .sort((a, b) => b.total - a.total);

    }, [lancamentosFiltrados]);

    // =========================
    // FUNÇÃO DE FORMATAÇÃO DE DATA (NOVO)
    // =========================
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const normalized = normalizeDateString(dateString);
            const [year, month, day] = normalized.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString;
        }
    };

    const isMonthly = !!selectedMonth;
    const handlePrint = () => window.print();

    const formatMonthLabel = (dateString) => {
        try {
            const [year, month] = dateString.split('-').map(Number);
            const date = new Date(Date.UTC(year, month - 1));

            return date.toLocaleString('pt-BR', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-serif font-semibold">Relatórios Financeiros</h2>

                <div className="flex gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 border rounded-xl"
                    >
                        <option value="">Todos</option>
                        {mesesDisponiveis.map(m => (
                            <option key={m} value={m}>
                                {formatMonthLabel(m)}
                            </option>
                        ))}
                    </select>

                    <button onClick={handlePrint} className="bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                        <FaPrint /> Imprimir
                    </button>
                </div>
            </div>

            {/* 🔥 NOVO: CARDS DE RESUMO */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card title="Entradas Totais" value={formatCurrency(totalEntradas)} valueColor="text-positivo" />
                <Card title="Saídas Totais" value={formatCurrency(totalSaidas)} valueColor="text-negativo" />
                <Card title="Saldo Total" value={formatCurrency(saldoTotal)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* RESUMO MENSAL */}
                <Card title="Resumo Mensal">
                    {relatorioMensal.map((rel, i) => {
                        const isCurrent = rel.original === new Date().toISOString().slice(0, 7);

                        return (
                            <div key={i} className={`border-b py-3 space-y-1 ${isCurrent ? 'bg-amber-50 rounded-xl p-3' : ''}`}>
                                
                                <div className="font-semibold text-gray-800 capitalize">
                                    {rel.mes}
                                </div>

                                <div className="flex justify-between text-green-700 text-sm">
                                    <span>Entradas</span>
                                    <span>{formatCurrency(rel.entradas)}</span>
                                </div>

                                <div className="flex justify-between text-red-600 text-sm">
                                    <span>Saídas</span>
                                    <span>{formatCurrency(rel.saidas)}</span>
                                </div>

                                <div className="flex justify-between font-bold pt-1 border-t">
                                    <span>Saldo</span>
                                    <span className={rel.saldo >= 0 ? 'text-green-700' : 'text-red-600'}>
                                        {formatCurrency(rel.saldo)}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </Card>

                {/* CATEGORIAS */}
                <Card title="Categorias">
                    {relatorioPorCategoria.map((rel, i) => (
                        <div key={i} className="flex justify-between py-2 border-b">
                            <span className="text-gray-700">{rel.categoria}</span>
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(rel.total)}
                            </span>
                        </div>
                    ))}
                </Card>
            </div>

            {/* 🔥 TABELA DETALHADA (APENAS MODO MENSAL) */}
            <div className="print-break" />
            {isMonthly && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-visible print:overflow-visible">
                    
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">
                            Lançamentos do mês
                        </h3>
                    </div>

                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="min-w-full text-sm">
                            
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Data</th>
                                    <th className="px-4 py-3 text-left">Descrição</th>
                                    <th className="px-4 py-3 text-left">Categoria</th>
                                    <th className="px-4 py-3 text-left">Tipo</th>
                                    <th className="px-4 py-3 text-right">Valor</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lancamentosFiltrados.map((l, index) => {
                                    const valor = safeParseFloat(l.valor);

                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            
                                            <td className="px-4 py-3 text-gray-700">
                                                {/* MUDANÇA APLICADA AQUI */}
                                                {formatDisplayDate(l.data)}
                                            </td>

                                            <td className="px-4 py-3">
                                                {l.descricao || '-'}
                                            </td>

                                            <td className="px-4 py-3">
                                                {l.categoria || '-'}
                                            </td>

                                            <td className={`px-4 py-3 font-medium ${
                                                l.tipo === 'Entrada'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {l.tipo}
                                            </td>

                                            <td className={`px-4 py-3 text-right font-semibold ${
                                                l.tipo === 'Entrada'
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                            }`}>
                                                {formatCurrency(valor)}
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Relatorios;