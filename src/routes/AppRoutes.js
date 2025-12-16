import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Lancamentos from '../pages/Lancamentos/Lancamentos';
import Relatorios from '../pages/Relatorios/Relatorios';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="lancamentos" element={<Lancamentos />} />
                <Route path="relatorios" element={<Relatorios />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;