'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { budgetRequestAPI, BudgetRequest, userAPI, User } from '@/lib/api';

interface ProjectView {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  carpenter: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  images: string[];
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';

function formatCurrency(value?: number | null): string {
  if (value == null) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mapStatus(status: BudgetRequest['status']): ProjectView['status'] {
  switch (status) {
    case 'OPEN':
      return 'pending';
    case 'WAITING_VISIT':
    case 'WAITING_BIDS':
      return 'in_progress';
    case 'CLOSED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function mapBudgetRequestToProject(br: BudgetRequest): ProjectView {
  const status = mapStatus(br.status);
  const anyBr: any = br as any;
  const priceNumeric =
    br.estimatedBudget ?? anyBr.lowestBid ?? anyBr.highestBid ?? null;

  return {
    id: br.id,
    title: `Projeto #${br.id}`,
    status,
    carpenter: 'A definir',
    price: formatCurrency(priceNumeric),
    createdAt: br.createdAt,
    updatedAt: br.updatedAt,
    description: br.description,
    images:
      br.referenceImages && br.referenceImages.length > 0
        ? br.referenceImages
        : [FALLBACK_IMAGE],
  };
}

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages'>('overview');
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [carpenters, setCarpenters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPeople, setLoadingPeople] = useState(true);

  useEffect(() => {
    const fetchBudgetRequests = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await budgetRequestAPI.getByClientId(user.id);
        setBudgetRequests(data);
      } catch (error) {
        console.error('Erro ao carregar solicitações de orçamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetRequests();
  }, [user]);

  useEffect(() => {
    const loadPeople = async () => {
      if (!user) return;
      try {
        setLoadingPeople(true);
        const [s, c] = await Promise.all([
          userAPI.getAll('SELLER'),
          userAPI.getAll('CARPENTER'),
        ]);
        setSellers(Array.isArray(s) ? s : []);
        setCarpenters(Array.isArray(c) ? c : []);
      } catch (e) {
        console.error('Erro ao carregar profissionais:', e);
      } finally {
        setLoadingPeople(false);
      }
    };
    loadPeople();
  }, [user]);

  const projects: ProjectView[] = useMemo(
    () => budgetRequests.map(mapBudgetRequestToProject),
    [budgetRequests]
  );

  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === 'completed').length;
    const inProgress = projects.filter((p) => p.status === 'in_progress').length;

    const anyBrs: any[] = budgetRequests as any[];
    const investedNumeric = anyBrs.reduce((acc, br) => {
      const value =
        br.estimatedBudget ?? br.lowestBid ?? br.highestBid ?? 0;
      return acc + (value || 0);
    }, 0);

    return {
      total,
      completed,
      inProgress,
      invested: formatCurrency(investedNumeric),
    };
  }, [projects, budgetRequests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-white/90 max-w-3xl">
            Acompanhe seus projetos e transforme suas ideias em realidade
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'projects'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Meus Projetos
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'messages'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensagens
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                      <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Concluídos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats.completed}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats.inProgress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Investido</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats.invested}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link
                    href="/solicitar-projeto"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-teal-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Solicitar Novo Projeto</h3>
                      <p className="text-sm text-gray-600">Crie uma nova solicitação</p>
                    </div>
                  </Link>

                  <Link
                    href="/marceneiros"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Encontrar Marceneiros</h3>
                      <p className="text-sm text-gray-600">Veja profissionais disponíveis</p>
                    </div>
                  </Link>

                  <Link
                    href="/meu-perfil"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Meu Perfil</h3>
                      <p className="text-sm text-gray-600">Editar informações pessoais</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Profissionais cadastrados */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profissionais na plataforma</h2>
                {loadingPeople && (
                  <p className="text-gray-500 text-sm">Carregando vendedores e marceneiros...</p>
                )}
                {!loadingPeople && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-teal-800 mb-3">Vendedores</h3>
                      {sellers.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum vendedor cadastrado.</p>
                      ) : (
                        <ul className="space-y-2">
                          {sellers.slice(0, 6).map((p) => (
                            <li
                              key={p.id}
                              className="flex justify-between items-center text-sm border border-gray-100 rounded-lg px-3 py-2"
                            >
                              <span className="font-medium text-gray-900">{p.name}</span>
                              <span className="text-gray-500 truncate max-w-[50%]">{p.phone}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-800 mb-3">Marceneiros</h3>
                      {carpenters.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum marceneiro cadastrado.</p>
                      ) : (
                        <ul className="space-y-2">
                          {carpenters.slice(0, 6).map((p) => (
                            <li
                              key={p.id}
                              className="flex justify-between items-center text-sm border border-gray-100 rounded-lg px-3 py-2"
                            >
                              <span className="font-medium text-gray-900">{p.name}</span>
                              <span className="text-gray-500 truncate max-w-[50%]">{p.phone}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/marceneiros"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Ver todos os marceneiros →
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
                  <Link
                    href="#"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => setActiveTab('projects')}
                  >
                    Ver todos →
                  </Link>
                </div>
                <div className="space-y-4">
                  {loading && (
                    <p className="text-gray-500 text-sm">Carregando projetos...</p>
                  )}
                  {!loading && projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(project.updatedAt)}</p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Meus Projetos</h2>
                <Link
                  href="/solicitar-projeto"
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                >
                  Novo Projeto
                </Link>
              </div>

              <div className="grid gap-6">
                {loading && (
                  <p className="text-gray-500 text-sm">Carregando projetos...</p>
                )}
                {!loading && projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-2">{project.description}</p>
                          <p className="text-sm text-gray-500">Marceneiro: {project.carpenter}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Preço estimado: <span className="font-medium text-gray-900">{project.price}</span></span>
                          <span>Criado: <span className="font-medium text-gray-900">{formatDate(project.createdAt)}</span></span>
                          <span>Atualizado: <span className="font-medium text-gray-900">{formatDate(project.updatedAt)}</span></span>
                        </div>
                        <div className="flex space-x-3">
                          <button className="text-teal-600 hover:text-teal-700 font-medium">
                            Ver Detalhes
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium">
                            Mensagens
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Mensagens</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mensagem ainda</h3>
                  <p className="text-gray-600 mb-6">
                    Quando você iniciar um projeto, poderá conversar diretamente com o marceneiro aqui.
                  </p>
                  <Link
                    href="/solicitar-projeto"
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                  >
                    Solicitar Primeiro Projeto
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
