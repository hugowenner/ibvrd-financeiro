import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-azul-ibvrd text-white flex-shrink-0">
            <div className="p-4 text-xl font-semibold">
                Financeiro
            </div>
            <nav className="mt-4">
                <NavLink to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Dashboard
                </NavLink>
                <NavLink to="/lancamentos" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Lançamentos
                </NavLink>
                <NavLink to="/relatorios" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700">
                    Relatórios
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;