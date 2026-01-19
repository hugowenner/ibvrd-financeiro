// src/pages/Relatorios/Relatorios.js
import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../contexts/FinanceContext'; 
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/formatters';
import { FaPrint } from 'react-icons/fa'; // Ícone de impressão

const Relatorios = () => {
    const { lancamentos, loading } = useContext(FinanceContext);
    
    // Estado para o filtro de mês selecionado (formato 'YYYY-MM')
    const [selectedMonth, setSelectedMonth] = useState('');

    // 1. Gera a lista de meses disponíveis nos lançamentos (para o Select)
    const mesesDisponiveis = useMemo(() => {
        const meses = new Set();
        lancamentos.forEach(l => {
            if (l) {
                const mesAno = l.data.substring(0, 7); // YYYY-MM
                meses.add(mesAno);
            }
        });
        // Converte para array, ordena (maior = mais recente) e volta para string
        return Array.from(meses).sort((a, b) => b.localeCompare(a));
    }, [lancamentos]);

    // 2. Filtra os lançamentos com base no mês selecionado
    const lancamentosFiltrados = useMemo(() => {
        if (!selectedMonth) {
            return lancamentos; // Se "Todos", retorna tudo
        }
        return lancamentos.filter(l => l && l.data.startsWith(selectedMonth));
    }, [lancamentos, selectedMonth]);

    // 3. Cálculo do Relatório Mensal (baseado nos lançamentos filtrados)
    const relatorioMensal = useMemo(() => {
        const agrupado = lancamentosFiltrados.reduce((acc, lancamento) => {
            if (!lancamento) return acc;

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
            original: mesAno, // Mantém para ordenação ou chave se precisar
            ...valores,
            saldo: valores.entradas - valores.saidas
        })).sort((a, b) => b.original.localeCompare(a.original));
    }, [lancamentosFiltrados]);

    // 4. Cálculo do Relatório por Categoria (baseado nos lançamentos filtrados)
    const relatorioPorCategoria = useMemo(() => {
        const agrupado = lancamentosFiltrados.reduce((acc, lancamento) => {
            if (!lancamento) return acc;

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
    }, [lancamentosFiltrados]);

    // Função para imprimir
    const handlePrint = () => {
        window.print();
    };

    // Formatador para o nome do mês no select (Ex: 2023-10 -> Outubro de 2023)
    const formatMonthLabel = (dateString) => {
        try {
            const [year, month] = dateString.split('-');
            const date = new Date(year, month - 1); 
            return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        } catch (e) {
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
            <div className="mb-6 md:mb-8 pb-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 font-semibold">Relatórios Financeiros</h2>
                    <p className="text-gray-500 mt-2 font-sans font-light text-sm md:text-lg">Análise detalhada por período e categoria.</p>
                </div>

                {/* ÁREA DE FILTROS E AÇÕES */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="w-full md:w-64">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-sans">
                            Filtrar por Mês
                        </label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition duration-200 font-sans text-sm shadow-sm cursor-pointer hover:border-amber-300"
                        >
                            <option value="">Todos os meses</option>
                            {mesesDisponiveis.map(mes => (
                                <option key={mes} value={mes}>
                                    {formatMonthLabel(mes)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-sans">
                            Ações
                        </label>
                        <button 
                            onClick={handlePrint}
                            className="w-full md:w-auto h-[42px] px-6 bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-md hover:bg-amber-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <FaPrint />
                            Imprimir Relatório
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Card Resumo Mensal */}
                <Card title={selectedMonth ? `Resumo de ${formatMonthLabel(selectedMonth)}` : "Resumo Mensal"} className="border-t-4 border-t-amber-600">
                    {relatorioMensal.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm italic">
                            Nenhum registro encontrado para o período selecionado.
                        </div>
                    ) : (
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
                    )}
                </Card>

                {/* Card Total por Categoria */}
                <Card title={selectedMonth ? "Categorias (Filtrado)" : "Total por Categoria"} className="border-t-4 border-t-amber-600">
                    {relatorioPorCategoria.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm italic">
                            Nenhum registro encontrado para o período selecionado.
                        </div>
                    ) : (
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
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Relatorios;