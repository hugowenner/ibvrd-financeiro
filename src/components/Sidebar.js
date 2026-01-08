// src/components/Sidebar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    // Fecha o sidebar ao mudar de rota (comportamento mobile)
    React.useEffect(() => {
        if (isOpen) onClose();
    }, [location.pathname, isOpen, onClose]);

    const linkClasses = ({ isActive }) =>
        `flex items-center py-4 px-6 border-l-4 transition-all duration-200 group mb-1 font-sans ${
            isActive 
                ? 'border-amber-600 bg-amber-50 text-amber-800 font-medium' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`;

    return (
        <>
            {/* Overlay Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                    aria-label="Fechar menu"
                ></div>
            )}

            {/* 
                CORREÇÃO: Removido 'hidden md:flex'.
                Agora usamos 'flex' e 'translate-x' para controlar a visibilidade
                tanto no mobile (off-screen) quanto no desktop (visível).
            */}
            <aside className={`
                fixed md:sticky top-0 z-50 md:z-auto w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col h-screen transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-gray-900 font-semibold tracking-tight border-l-4 border-amber-600 pl-3">Menu</h2>
                    {/* Botão fechar apenas mobile */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 p-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <nav className="flex-1 mt-6 space-y-2 px-2">
                    <NavLink to="/dashboard" className={linkClasses} onClick={() => onClose()}>
                        <span className="text-sm font-medium">Visão Geral</span>
                    </NavLink>
                    <NavLink to="/lancamentos" className={linkClasses} onClick={() => onClose()}>
                        <span className="text-sm font-medium">Lançamentos</span>
                    </NavLink>
                    <NavLink to="/relatorios" className={linkClasses} onClick={() => onClose()}>
                        <span className="text-sm font-medium">Relatórios</span>
                    </NavLink>
                </nav>

                <div className="p-6 border-t border-gray-50 mt-auto">
                    <div className="text-xs text-gray-400 text-center font-serif tracking-widest uppercase">
                        IBVRD System
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;