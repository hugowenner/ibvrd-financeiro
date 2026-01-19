// src/components/Card.js
import React from 'react';

const Card = ({ title, value, valueColor = "text-gray-800", className = "", children }) => {
    const getColorClass = (color) => {
        if (color === 'text-positivo') return 'text-green-700';
        if (color === 'text-negativo') return 'text-red-700';
        return color;
    };

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col justify-between ${className}`}>
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-sans mb-2">{title}</h3>
            
            {/* CORREÇÃO: Verifica se tem conteúdo 'children' (a tabela). Se tiver, renderiza. Se não, renderiza o valor padrão. */}
            {children ? (
                <div className="mt-1 w-full">{children}</div>
            ) : (
                <p className={`mt-1 text-2xl md:text-3xl font-serif font-bold tracking-tight ${getColorClass(valueColor)}`}>{value}</p>
            )}
        </div>
    );
};

export default Card;