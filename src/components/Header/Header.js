import React from 'react';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
            <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 tracking-tight font-medium">Sistema Financeiro IBVRD</h1>
                    <div className="w-20 h-1 bg-amber-600 mt-2"></div>
                </div>
                <div className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Gestão de Recursos
                </div>
            </div>
        </header>
    );
};

export default Header;