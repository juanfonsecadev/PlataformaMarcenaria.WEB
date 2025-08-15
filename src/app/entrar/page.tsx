'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type UserType = 'CLIENT' | 'SELLER' | 'CARPENTER';

export default function LoginPage() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const userTypeConfigs = {
    CLIENT: {
      title: 'Cliente',
      description: 'Acesse para solicitar serviços e acompanhar seus projetos',
      icon: '🏠',
      color: 'teal'
    },
    SELLER: {
      title: 'Vendedor',
      description: 'Acesse para gerenciar visitas técnicas e projetos',
      icon: '📋',
      color: 'purple'
    },
    CARPENTER: {
      title: 'Marceneiro',
      description: 'Acesse para encontrar projetos e enviar propostas',
      icon: '🔨',
      color: 'blue'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    try {
      setLoading(true);
      setError('');
      
      await login(email, password);
      
      // Redirecionar baseado no tipo de usuário
      switch (selectedType) {
        case 'CLIENT':
          router.push('/dashboard/cliente');
          break;
        case 'SELLER':
          router.push('/dashboard/vendedor');
          break;
        case 'CARPENTER':
          router.push('/dashboard/marceneiro');
          break;
        default:
          router.push('/');
      }
    } catch (error) {
      setError('Erro no login. Verifique suas credenciais.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-teal-600 rounded mr-3 flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Five Marcenaria</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Escolha o tipo de usuário para continuar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selection */}
          {!selectedType ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Como você quer acessar?
              </h3>
              {(['CLIENT', 'SELLER', 'CARPENTER'] as UserType[]).map((type) => {
                const config = userTypeConfigs[type];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full flex items-center p-4 border rounded-lg hover:shadow-md transition-all duration-200 ${
                      type === 'CLIENT' ? 'border-teal-200 hover:border-teal-300' :
                      type === 'SELLER' ? 'border-purple-200 hover:border-purple-300' :
                      'border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-2xl mr-4">{config.icon}</span>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{config.title}</h4>
                      <p className="text-sm text-gray-500">{config.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Login Form */
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Login como {userTypeConfigs[selectedType].title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  Trocar tipo
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/cadastrar" className="font-medium text-teal-600 hover:text-teal-500">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 