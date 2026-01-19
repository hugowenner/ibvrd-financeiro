// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { financeApi } from '../services/api';

export const AuthContext = createContext();

// Hook personalizado para facilitar o uso
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifica se já tem token salvo ao carregar
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Aqui chamamos a financeApi que criamos no passo anterior
        const response = await financeApi.login(email, password);
        
        if (response.success) {
            const userData = response.user;
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            return true;
        }
        throw new Error(response.error || 'Falha no login');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};