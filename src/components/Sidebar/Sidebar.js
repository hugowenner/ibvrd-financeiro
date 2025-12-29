import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    // Função para determinar classes baseadas no estado ativo
    const linkClasses = ({ isActive }) =>
        `flex items-center py-3 px-6 border-l-4 transition-all duration-200 group ${
            isActive 
                ? 'border-amber-600 bg-amber-50 text-amber-800 font-medium' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-amber-700 hover:border-gray-200'
        }`;

    return (
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-serif text-gray-900 font-bold tracking-tight">Financeiro</h2>
                <div className="w-8 h-0.5 bg-amber-600 mt-2"></div>
            </div>
            
            <nav className="flex-1 mt-4 space-y-1">
                <NavLink to="/dashboard" className={linkClasses}>
                    <span className="text-sm font-serif">Dashboard</span>
                </NavLink>
                <NavLink to="/lancamentos" className={linkClasses}>
                    <span className="text-sm font-serif">Lançamentos</span>
                </NavLink>
                <NavLink to="/relatorios" className={linkClasses}>
                    <span className="text-sm font-serif">Relatórios</span>
                </NavLink>
            </nav>

            <div className="p-6 border-t border-gray-100">
                <div className="text-xs text-gray-400 text-center font-serif tracking-widest uppercase">
                    IBVRD System
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;