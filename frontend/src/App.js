// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// Removemos o FinanceProvider daqui
import { AuthProvider } from './contexts/AuthContext'; 
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <AuthProvider>
      {/* O FinanceProvider foi movido para dentro das rotas protegidas */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;