// src/pages/Login/Login.js
import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa'; 
// CORREÇÃO: Adicionei mais um ponto '../../' para sair da pasta Login
import { useAuth } from '../../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

// ... O resto do código permanece igual ...

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      await login(email, password);
      // Redireciona para o Dashboard do financeiro
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Email ou senha incorretos.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* HEADER: Mantivemos o padrão visual do sistema de Cadastro */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 py-6 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-serif text-gray-900 font-semibold tracking-tight leading-tight">
            Igreja Batista<br className="md:hidden" />
            Vida no Reino de Deus
          </h1>
          <div className="h-1 w-20 md:w-24 bg-amber-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(217,119,6,0.5)]"></div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md overflow-hidden">
          
          <div className="p-8 pb-6 text-center border-b border-gray-50">
              <div className="mb-3 flex justify-center text-amber-600">
                  <FaLock size={32} />
              </div>
              <h2 className="text-3xl font-serif text-gray-900 font-semibold tracking-tight mb-2">Acesso Restrito</h2>
              {/* ALTERAÇÃO: Texto alterado para Sistema Financeiro */}
              <p className="text-sm text-gray-500 tracking-wide font-medium">
                Sistema Financeiro
              </p>
              <div className="h-1 w-16 bg-amber-600 mx-auto rounded-full opacity-50 mt-4 shadow-[0_0_10px_rgba(217,119,6,0.5)]"></div>
          </div>

          <div className="p-8 pt-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-sm flex items-center animate-pulse">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-xs font-bold uppercase tracking-widest mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-xs font-bold uppercase tracking-widest mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  className="appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  className="w-full bg-amber-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 rounded-xl shadow-md hover:bg-amber-700 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  type="submit"
                >
                  Entrar no Sistema
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;