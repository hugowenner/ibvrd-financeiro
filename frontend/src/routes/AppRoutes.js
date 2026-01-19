// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

// Importações de Páginas
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Lancamentos from '../pages/Lancamentos/Lancamentos';
import Relatorios from '../pages/Relatorios/Relatorios';

// IMPORTANTE: Caminho ajustado para a nova pasta src/pages/Login
import Login from '../pages/Login/Login'; 

// Componente de Proteção
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <div className="p-10 text-center">Carregando sessão...</div>;
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
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