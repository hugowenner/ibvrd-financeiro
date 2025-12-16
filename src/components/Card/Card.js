import React from 'react';

const Card = ({ title, value, valueColor = "text-gray-800", className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
            <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
    );
};

export default Card;