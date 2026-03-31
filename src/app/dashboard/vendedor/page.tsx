'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { budgetRequestAPI, visitAPI, BudgetRequest } from '@/lib/api';

interface Project {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  client: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  description: string;
  budget: string;
  createdAt: string;
  scheduledVisit?: string;
  projectFiles?: string[];
  images: string[];
}

interface Visit {
  id: number;
  projectId: number;
  projectTitle: string;
  client: string;
  address: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function VendedorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'visits' | 'calendar'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [visitsData, setVisitsData] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [requests, visits] = await Promise.all([
          budgetRequestAPI.getByStatus('OPEN'),
          visitAPI.getBySellerId(user.id),
        ]);

        const mappedProjects: Project[] = (requests as BudgetRequest[]).map((item) => ({
          id: item.id,
          title: `Projeto #${item.id}`,
          status: item.status === 'OPEN' ? 'pending' : item.status === 'CLOSED' ? 'completed' : 'in_progress',
          client: item.client?.name || 'Cliente',
          clientPhone: item.client?.phone || '-',
          clientEmail: item.client?.email || '-',
          address: `${item.location?.street || ''}, ${item.location?.number || ''} - ${item.location?.city || ''}/${item.location?.state || ''}`,
          description: item.description,
          budget: item.estimatedBudget ? item.estimatedBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A combinar',
          createdAt: item.createdAt,
          images: item.referenceImages?.length ? item.referenceImages : ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
        }));

        const mappedVisits: Visit[] = (visits as any[]).map((visit) => ({
          id: visit.id,
          projectId: visit.budgetRequest?.id,
          projectTitle: `Projeto #${visit.budgetRequest?.id ?? visit.id}`,
          client: visit.budgetRequest?.client?.name || 'Cliente',
          address: `${visit.budgetRequest?.location?.street || ''}, ${visit.budgetRequest?.location?.number || ''} - ${visit.budgetRequest?.location?.city || ''}/${visit.budgetRequest?.location?.state || ''}`,
          scheduledDate: visit.scheduledDate,
          status:
            visit.status === 'SCHEDULED'
              ? 'scheduled'
              : visit.status === 'COMPLETED'
              ? 'completed'
              : 'cancelled',
          notes: visit.notes,
        }));

        setProjects(mappedProjects);
        setVisitsData(mappedVisits);
      } catch (error) {
        console.error('Erro ao carregar dashboard do vendedor:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

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
      case 'pending': return 'Aguardando Visita';
      case 'in_progress': return 'Projeto em Andamento';
      case 'completed': return 'Projeto Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getVisitStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisitStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Realizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Dashboard Vendedor
          </h1>
          <p className="text-white/90 max-w-3xl">
            Bem-vindo, {user?.name}! Gerencie suas visitas técnicas e projetos
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projetos
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'visits'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visitas Técnicas
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendário
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
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                      <p className="text-2xl font-bold text-gray-900">{loading ? '...' : projects.length}</p>
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
                      <p className="text-sm font-medium text-gray-600">Projetos Concluídos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : projects.filter(p => p.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Visitas Agendadas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : visitsData.filter(v => v.status === 'scheduled').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Faturamento</p>
                      <p className="text-2xl font-bold text-gray-900">—</p>
                      <p className="text-xs text-gray-400 mt-1">Resumo financeiro em breve</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link
                    href="/nova-visita"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Agendar Visita</h3>
                      <p className="text-sm text-gray-600">Nova visita técnica</p>
                    </div>
                  </Link>

                  <Link
                    href="/projetos-disponiveis"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Projetos Disponíveis</h3>
                      <p className="text-sm text-gray-600">Ver solicitações</p>
                    </div>
                  </Link>

                  <Link
                    href="/relatorios"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Relatórios</h3>
                      <p className="text-sm text-gray-600">Performance e vendas</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
                  <Link
                    href="#"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                    onClick={() => setActiveTab('projects')}
                  >
                    Ver todos →
                  </Link>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.client}</p>
                        <p className="text-sm text-gray-500">{formatDate(project.createdAt)}</p>
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
                  href="/projetos-disponiveis"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Ver Projetos Disponíveis
                </Link>
              </div>

              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-4">{project.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><span className="font-medium">Cliente:</span> {project.client}</p>
                              <p><span className="font-medium">Telefone:</span> {project.clientPhone}</p>
                              <p><span className="font-medium">Email:</span> {project.clientEmail}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Endereço:</span> {project.address}</p>
                              <p><span className="font-medium">Orçamento:</span> {project.budget}</p>
                              <p><span className="font-medium">Criado em:</span> {formatDate(project.createdAt)}</p>
                            </div>
                          </div>

                          {project.projectFiles && project.projectFiles.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-gray-900 mb-2">Arquivos do Projeto:</p>
                              <div className="flex flex-wrap gap-2">
                                {project.projectFiles.map((file, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {file}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-4">
                          <button className="text-purple-600 hover:text-purple-700 font-medium">
                            Editar Projeto
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium">
                            Enviar Arquivos
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium">
                            Contatar Cliente
                          </button>
                        </div>
                        {project.scheduledVisit && (
                          <span className="text-sm text-gray-500">
                            Visita: {formatDate(project.scheduledVisit)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Visitas Técnicas</h2>
                <Link
                  href="/nova-visita"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Agendar Nova Visita
                </Link>
              </div>

              <div className="grid gap-6">
                {visitsData.map((visit) => (
                  <div key={visit.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{visit.projectTitle}</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><span className="font-medium">Cliente:</span> {visit.client}</p>
                            <p><span className="font-medium">Endereço:</span> {visit.address}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Data:</span> {formatDateTime(visit.scheduledDate)}</p>
                            <p><span className="font-medium">Status:</span> 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getVisitStatusColor(visit.status)}`}>
                                {getVisitStatusText(visit.status)}
                              </span>
                            </p>
                          </div>
                        </div>
                        {visit.notes && (
                          <div className="mt-4">
                            <p className="font-medium text-gray-900 mb-1">Observações:</p>
                            <p className="text-gray-600 text-sm">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <button className="text-purple-600 hover:text-purple-700 font-medium">
                          Ver Detalhes
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 font-medium">
                          Editar Visita
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 font-medium">
                          Contatar Cliente
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Calendário de Visitas</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Calendário em desenvolvimento</h3>
                  <p className="text-gray-600 mb-6">
                    Em breve você poderá visualizar todas as suas visitas em um calendário interativo.
                  </p>
                  <Link
                    href="/nova-visita"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Agendar Visita
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
