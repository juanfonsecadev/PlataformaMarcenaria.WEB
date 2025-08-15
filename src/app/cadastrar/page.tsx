'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserCreateDTO } from '@/lib/api';

type UserType = 'CLIENT' | 'SELLER' | 'CARPENTER';

export default function CadastroPage() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    document: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const userTypeConfigs = {
    CLIENT: {
      title: 'Cliente',
      description: 'Cadastre-se para solicitar serviços de marcenaria',
      icon: '🏠',
      color: 'teal',
      benefits: [
        'Solicite serviços personalizados',
        'Receba visitas técnicas',
        'Compare propostas de marceneiros',
        'Acompanhe projetos online',
        'Pagamento seguro pela plataforma'
      ]
    },
    SELLER: {
      title: 'Vendedor',
      description: 'Cadastre-se para realizar visitas técnicas e projetos',
      icon: '📋',
      color: 'purple',
      benefits: [
        'Realize visitas técnicas',
        'Elabore projetos detalhados',
        'Gerencie solicitações de clientes',
        'Receba remuneração pelos serviços',
        'Seja parceiro da plataforma'
      ]
    },
    CARPENTER: {
      title: 'Marceneiro',
      description: 'Cadastre-se para encontrar projetos e clientes',
      icon: '🔨',
      color: 'blue',
      benefits: [
        'Encontre projetos alinhados ao seu perfil',
        'Envie propostas competitivas',
        'Comunique-se diretamente com clientes',
        'Receba pagamentos com segurança',
        'Construa sua reputação na plataforma'
      ]
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Você deve aceitar os termos de uso');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const userData: UserCreateDTO = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: selectedType,
        document: formData.document || undefined
      };
      
      await register(userData);
      
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
      setError('Erro no cadastro. Tente novamente.');
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-600 rounded mr-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">Five Marcenaria</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crie sua conta
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha como você quer participar da nossa plataforma
          </p>
        </div>

        {/* User Type Selection */}
        {!selectedType ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(['CLIENT', 'SELLER', 'CARPENTER'] as UserType[]).map((type) => {
              const config = userTypeConfigs[type];
              return (
                <div
                  key={type}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedType(type)}
                >
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">{config.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {config.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {config.description}
                    </p>
                    
                    <ul className="text-left space-y-3 mb-6">
                      {config.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors duration-200 ${
                        type === 'CLIENT' ? 'bg-teal-600 hover:bg-teal-700' :
                        type === 'SELLER' ? 'bg-purple-600 hover:bg-purple-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Escolher {config.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Registration Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{userTypeConfigs[selectedType].icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cadastro como {userTypeConfigs[selectedType].title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  Trocar tipo
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="seu@email.com"
                  />
                </div>

                {selectedType === 'CARPENTER' && (
                  <div>
                    <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF/CNPJ
                    </label>
                    <input
                      type="text"
                      id="document"
                      name="document"
                      value={formData.document}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="123.456.789-00"
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar senha *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    Li e aceito os{' '}
                    <a href="/termos" className="text-teal-600 hover:text-teal-500">
                      Termos de Uso
                    </a>{' '}
                    e{' '}
                    <a href="/privacidade" className="text-teal-600 hover:text-teal-500">
                      Política de Privacidade
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedType === 'CLIENT' ? 'bg-teal-600 hover:bg-teal-700' :
                    selectedType === 'SELLER' ? 'bg-purple-600 hover:bg-purple-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Criando conta...' : `Criar conta como ${userTypeConfigs[selectedType].title}`}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link href="/entrar" className="font-medium text-teal-600 hover:text-teal-500">
                      Faça login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 