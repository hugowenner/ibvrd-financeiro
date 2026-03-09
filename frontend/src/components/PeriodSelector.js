// src/components/PeriodSelector.js
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const PeriodSelector = ({ period, setPeriod }) => {
    const options = [
        { value: 'today', label: 'Hoje' },
        { value: '7', label: '7 dias' },
        { value: '30', label: '30 dias' },
        { value: 'month', label: 'Mês Atual' },
        { value: 'all', label: 'Todo Período' },
    ];

    return (
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            <FaCalendarAlt className="ml-3 text-gray-400 text-sm" />
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => setPeriod(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        period === opt.value 
                        ? 'bg-amber-500 text-white shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;