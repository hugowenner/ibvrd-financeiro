import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext';
import Card from '../../components/Card';
import PeriodSelector from '../../components/PeriodSelector';
import { formatCurrency } from '../../utils/formatters';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Dashboard = () => {
    const { lancamentos, loading } = useContext(FinanceContext);
    const [period, setPeriod] = useState('month');

    const safeParseFloat = (value) => {
        if (value === null || value === undefined || value === '') return 0;

        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        let str = String(value).trim();
        str = str.replace(/[^\d.,-]/g, '');

        if (str.includes(',') && str.includes('.')) {
            str = str.replace(/\./g, '').replace(',', '.');
        } else if (str.includes(',')) {
            str = str.replace(',', '.');
        }

        const parsed = parseFloat(str);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const normalizeTipo = (tipo) => {
        const value = String(tipo || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (value === 'entrada' || value === 'entradas') return 'entrada';
        if (value === 'saida' || value === 'saidas') return 'saida';

        return value;
    };

    const getDateRange = (periodKey) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        switch (periodKey) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case '7':
                start.setDate(now.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case '30':
                start.setDate(now.getDate() - 29);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case 'month':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case 'all':
            default:
                return null;
        }

        return { start, end };
    };

    const listaLancamentos = useMemo(() => {
        return Array.isArray(lancamentos) ? lancamentos : [];
    }, [lancamentos]);

    const filteredLancamentos = useMemo(() => {
        const range = getDateRange(period);
        if (!range) return listaLancamentos;

        return listaLancamentos.filter((l) => {
            if (!l || !l.data) return false;
            const date = new Date(`${l.data}T00:00:00`);
            return date >= range.start && date <= range.end;
        });
    }, [listaLancamentos, period]);

    const previousPeriodLancamentos = useMemo(() => {
        const range = getDateRange(period);
        if (!range) return [];

        let prevStart;
        let prevEnd;

        if (period === 'today') {
            prevStart = new Date(range.start);
            prevStart.setDate(prevStart.getDate() - 1);
            prevStart.setHours(0, 0, 0, 0);

            prevEnd = new Date(prevStart);
            prevEnd.setHours(23, 59, 59, 999);
        } else if (period === '7') {
            prevStart = new Date(range.start);
            prevStart.setDate(prevStart.getDate() - 7);
            prevStart.setHours(0, 0, 0, 0);

            prevEnd = new Date(range.start);
            prevEnd.setMilliseconds(-1);
        } else if (period === '30') {
            prevStart = new Date(range.start);
            prevStart.setDate(prevStart.getDate() - 30);
            prevStart.setHours(0, 0, 0, 0);

            prevEnd = new Date(range.start);
            prevEnd.setMilliseconds(-1);
        } else if (period === 'month') {
            prevStart = new Date(range.start.getFullYear(), range.start.getMonth() - 1, 1, 0, 0, 0, 0);
            prevEnd = new Date(range.start.getFullYear(), range.start.getMonth(), 0, 23, 59, 59, 999);
        } else {
            return [];
        }

        return listaLancamentos.filter((l) => {
            if (!l || !l.data) return false;
            const date = new Date(`${l.data}T00:00:00`);
            return date >= prevStart && date <= prevEnd;
        });
    }, [listaLancamentos, period]);

    const sumByTipo = (items, tipoDesejado) => {
        return items
            .filter((l) => normalizeTipo(l.tipo_normalizado || l.tipo) === tipoDesejado)
            .reduce((sum, l) => sum + safeParseFloat(l.valor), 0);
    };

    const countByTipo = (items, tipoDesejado) => {
        return items.filter((l) => normalizeTipo(l.tipo_normalizado || l.tipo) === tipoDesejado).length;
    };

    const calcPercent = (current, prev) => {
        if (prev === 0 && current === 0) return 0;
        if (prev === 0 && current > 0) return null;
        return ((current - prev) / prev) * 100;
    };

    const metrics = useMemo(() => {
        const totalEntradas = sumByTipo(filteredLancamentos, 'entrada');
        const totalSaidas = sumByTipo(filteredLancamentos, 'saida');
        const saldo = totalEntradas - totalSaidas;

        const prevEntradas = sumByTipo(previousPeriodLancamentos, 'entrada');
        const prevSaidas = sumByTipo(previousPeriodLancamentos, 'saida');

        return {
            totalEntradas: Number.isFinite(totalEntradas) ? totalEntradas : 0,
            totalSaidas: Number.isFinite(totalSaidas) ? totalSaidas : 0,
            saldo: Number.isFinite(saldo) ? saldo : 0,
            variacaoEntradas: calcPercent(totalEntradas, prevEntradas),
            variacaoSaidas: calcPercent(totalSaidas, prevSaidas),
        };
    }, [filteredLancamentos, previousPeriodLancamentos]);

    const totalizador = useMemo(() => {
        const entradas = countByTipo(filteredLancamentos, 'entrada');
        const saidas = countByTipo(filteredLancamentos, 'saida');

        return {
            total: filteredLancamentos.length,
            entradas,
            saidas,
        };
    }, [filteredLancamentos]);

    const topCategories = useMemo(() => {
        const totals = filteredLancamentos.reduce((acc, item) => {
            if (!item || !item.categoria) return acc;
            acc[item.categoria] = (acc[item.categoria] || 0) + safeParseFloat(item.valor);
            return acc;
        }, {});

        const sorted = Object.entries(totals)
            .map(([categoria, total]) => ({ categoria, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const maxVal = sorted.length > 0 ? sorted[0].total : 0;
        return { data: sorted, maxVal };
    }, [filteredLancamentos]);

    const distribuicao = useMemo(() => {
        const totals = filteredLancamentos.reduce((acc, item) => {
            if (!item || !item.categoria) return acc;
            acc[item.categoria] = (acc[item.categoria] || 0) + safeParseFloat(item.valor);
            return acc;
        }, {});

        const data = Object.entries(totals).map(([categoria, total]) => ({ categoria, total }));
        data.sort((a, b) => b.total - a.total);

        const maxVal = data.length > 0 ? data[0].total : 0;
        return { data, maxVal };
    }, [filteredLancamentos]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">
                        Visão Financeira
                    </h2>
                    <p className="text-gray-500 mt-1 font-sans font-light text-sm md:text-lg">
                        Resumo geral do período.
                    </p>
                </div>
                <PeriodSelector period={period} setPeriod={setPeriod} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <Card title="Entradas" value={formatCurrency(metrics.totalEntradas)} valueColor="text-positivo">
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        {metrics.variacaoEntradas === null ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <FaArrowUp />
                                Novo
                            </span>
                        ) : metrics.variacaoEntradas !== 0 ? (
                            <span
                                className={`flex items-center gap-1 ${
                                    metrics.variacaoEntradas >= 0 ? 'text-green-600' : 'text-red-500'
                                }`}
                            >
                                {metrics.variacaoEntradas >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                {Math.abs(metrics.variacaoEntradas).toFixed(1)}%
                            </span>
                        ) : null}
                        <span className="text-gray-400 ml-1">vs período anterior</span>
                    </div>
                </Card>

                <Card title="Saídas" value={formatCurrency(metrics.totalSaidas)} valueColor="text-negativo">
                    <div className="mt-2 flex items-center gap-1 text-xs">
                        {metrics.variacaoSaidas === null ? (
                            <span className="flex items-center gap-1 text-red-500">
                                <FaArrowUp />
                                Novo
                            </span>
                        ) : (
                            <span
                                className={`flex items-center gap-1 ${
                                    metrics.variacaoSaidas <= 0 ? 'text-green-600' : 'text-red-500'
                                }`}
                            >
                                {metrics.variacaoSaidas <= 0 ? <FaArrowDown /> : <FaArrowUp />}
                                {Math.abs(metrics.variacaoSaidas).toFixed(1)}%
                            </span>
                        )}
                        <span className="text-gray-400 ml-1">vs período anterior</span>
                    </div>
                </Card>

                <Card
                    title="Saldo Atual"
                    value={formatCurrency(metrics.saldo)}
                    valueColor={metrics.saldo >= 0 ? 'text-positivo' : 'text-negativo'}
                >
                    <div className="mt-2 h-4"></div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                <Card title="Totalizador" className="border-l-4 border-l-blue-500">
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 font-mono">
                                {totalizador.total}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-green-600 uppercase tracking-wide">Entradas</p>
                            <p className="mt-1 text-2xl font-bold text-green-600 font-mono">
                                {totalizador.entradas}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-red-500 uppercase tracking-wide">Saídas</p>
                            <p className="mt-1 text-2xl font-bold text-red-500 font-mono">
                                {totalizador.saidas}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="Categorias" className="border-l-4 border-l-indigo-500">
                    <div className="mt-4 space-y-3">
                        {topCategories.data.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-4">Sem dados</p>
                        ) : (
                            topCategories.data.map((cat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 truncate">
                                            {cat.categoria}
                                        </span>
                                        <span className="font-mono text-gray-900 ml-2">
                                            {formatCurrency(cat.total)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: topCategories.maxVal > 0
                                                    ? `${(cat.total / topCategories.maxVal) * 100}%`
                                                    : '0%',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-4 md:p-8 rounded-2xl">
                <h3 className="text-lg md:text-xl font-serif text-gray-800 font-semibold mb-6 md:mb-8 border-b border-gray-50 pb-4">
                    Detalhamento por Categoria
                </h3>

                {distribuicao.data.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        Sem dados suficientes para gerar gráfico.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {distribuicao.data.map((item) => {
                            const percentagem =
                                distribuicao.maxVal > 0 ? (item.total / distribuicao.maxVal) * 100 : 0;

                            return (
                                <div key={item.categoria}>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs md:text-sm font-medium text-gray-600 font-sans">
                                            {item.categoria}
                                        </span>
                                        <span className="text-xs md:text-sm font-bold text-gray-900 font-mono">
                                            {formatCurrency(item.total)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentagem}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;