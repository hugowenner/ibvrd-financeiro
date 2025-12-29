import React from 'react';

const Card = ({ title, value, valueColor = "text-gray-800", className = "" }) => {
    // Mapeamento de cores antigas para o novo padrão dourado/cinza/vermelho/verde
    // Isso garante que a lógica existente funcione com o novo design
    const getColorClass = (color) => {
        if (color === 'text-positivo') return 'text-green-700';
        if (color === 'text-negativo') return 'text-red-700';
        return color;
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 ${className}`}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
            <p className={`mt-1 text-3xl font-serif font-bold ${getColorClass(valueColor)}`}>{value}</p>
        </div>
    );
};

export default Card;