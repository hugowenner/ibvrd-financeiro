// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext'; // Seu contexto existente
import { AuthProvider } from './contexts/AuthContext'; // NOVO contexto
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <AuthProvider> {/* 1. Auth gerencia o login */}
      <FinanceProvider> {/* 2. Finance gerencia os dados */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;