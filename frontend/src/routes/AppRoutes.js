// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// NOVO: Importar o FinanceProvider
import { FinanceProvider } from '../contexts/FinanceContext'; 

// Importações de Páginas
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Lancamentos from '../pages/Lancamentos/Lancamentos';
import Relatorios from '../pages/Relatorios/Relatorios';
import Login from '../pages/Login/Login'; 

// Componente de Proteção Atualizado
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <div className="p-10 text-center">Carregando sessão...</div>;
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // SOLUÇÃO: Envolvemos os filhos (rotas protegidas) com o FinanceProvider.
    // Agora ele só monta quando o usuário está autenticado.
    return (
        <FinanceProvider>
            {children}
        </FinanceProvider>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="lancamentos" element={<Lancamentos />} />
                <Route path="relatorios" element={<Relatorios />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;