import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;