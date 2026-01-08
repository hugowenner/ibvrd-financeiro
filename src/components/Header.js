// src/components/Header.js
import React from 'react';

const Header = ({ onMenuToggle }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 transition-all duration-300 h-16 md:h-auto">
            <div className="container mx-auto px-4 md:px-6 py-3 md:py-6 flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuToggle}
                        className="md:hidden text-gray-600 hover:text-amber-600 transition-colors p-2"
                        aria-label="Abrir menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-0.5 md:mb-1">IBVRD</span>
                        <h1 className="text-lg md:text-3xl font-serif text-gray-900 tracking-tight font-semibold leading-none">Sistema Financeiro</h1>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sistema Online</span>
                </div>
            </div>
        </header>
    );
};

export default Header;