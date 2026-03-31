'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { bidAPI, budgetRequestAPI, BudgetRequest } from '@/lib/api';

interface Project {
  id: number;
  title: string;
  status: 'available' | 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  client: string;
  clientLocation: string;
  description: string;
  budget: string;
  deadline: string;
  createdAt: string;
  proposalDeadline: string;
  images: string[];
  requirements: string[];
  myProposal?: {
    price: string;
    deadline: string;
    message: string;
    submittedAt: string;
  };
}

interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  client: string;
  price: string;
  deadline: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  clientResponse?: string;
}

export default function MarceneiroDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'proposals' | 'portfolio'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [openReq, visitReq, bidsReq, myBids] = await Promise.all([
          budgetRequestAPI.getByStatus('OPEN'),
          budgetRequestAPI.getByStatus('WAITING_VISIT'),
          budgetRequestAPI.getByStatus('WAITING_BIDS'),
          bidAPI.getByCarpenterId(user.id),
        ]);

        const merged = new Map<number, BudgetRequest>();
        [...(openReq as BudgetRequest[]), ...(visitReq as BudgetRequest[]), ...(bidsReq as BudgetRequest[])].forEach(
          (br) => merged.set(br.id, br)
        );
        const requests = Array.from(merged.values());

        const bidsByRequest = new Map<number, any>(
          (myBids as any[]).map((b) => [b.budgetRequest?.id, b])
        );

        const mappedProjects: Project[] = requests.map((item) => {
          const myBid = bidsByRequest.get(item.id);
          const projectStatus: Project['status'] = myBid
            ? myBid.status === 'ACCEPTED'
              ? 'accepted'
              : myBid.status === 'REJECTED'
              ? 'cancelled'
              : 'proposed'
            : 'available';

          return {
            id: item.id,
            title: `Projeto #${item.id}`,
            status: projectStatus,
            client: item.client?.name || 'Cliente',
            clientLocation: `${item.location?.city || ''}/${item.location?.state || ''}`,
            description: item.description,
            budget: item.estimatedBudget
              ? item.estimatedBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'A combinar',
            deadline: item.desiredDeadline || item.updatedAt,
            createdAt: item.createdAt,
            proposalDeadline: item.desiredDeadline || item.updatedAt,
            images: item.referenceImages?.length ? item.referenceImages : ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'],
            requirements: [],
            myProposal: myBid
              ? {
                  price: myBid.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'A combinar',
                  deadline: myBid.executionTimeInDays ? `${myBid.executionTimeInDays} dias` : '-',
                  message: myBid.description || '',
                  submittedAt: myBid.createdAt,
                }
              : undefined,
          };
        });

        const mappedProposals: Proposal[] = (myBids as any[]).map((bid) => ({
          id: bid.id,
          projectId: bid.budgetRequest?.id,
          projectTitle: `Projeto #${bid.budgetRequest?.id ?? bid.id}`,
          client: bid.budgetRequest?.client?.name || 'Cliente',
          price: bid.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'A combinar',
          deadline: bid.executionTimeInDays ? `${bid.executionTimeInDays} dias` : '-',
          message: bid.description || '',
          status:
            bid.status === 'ACCEPTED'
              ? 'accepted'
              : bid.status === 'REJECTED'
              ? 'rejected'
              : 'pending',
          submittedAt: bid.createdAt,
        }));

        setProjects(mappedProjects);
        setProposals(mappedProposals);
      } catch (error) {
        console.error('Erro ao carregar dashboard do marceneiro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'proposed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'proposed': return 'Proposta Enviada';
      case 'accepted': return 'Aceito';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProposalStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Resposta';
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Rejeitada';
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
      <section className="bg-gradient-to-r from-blue-700 to-cyan-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Dashboard Marceneiro
          </h1>
          <p className="text-white/90 max-w-3xl">
            Bem-vindo, {user?.name}! Encontre projetos e gerencie suas propostas
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
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projetos
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'proposals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Propostas
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 border-b-2 font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Portfólio
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
                      <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : projects.filter(p => ['accepted', 'in_progress'].includes(p.status)).length}
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">Propostas Aceitas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : proposals.filter(p => p.status === 'accepted').length}
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
                      <p className="text-sm font-medium text-gray-600">Propostas Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : proposals.filter(p => p.status === 'pending').length}
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
                    href="/projetos-disponiveis"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Buscar Projetos</h3>
                      <p className="text-sm text-gray-600">Encontrar novos projetos</p>
                    </div>
                  </Link>

                  <Link
                    href="/minhas-propostas"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Minhas Propostas</h3>
                      <p className="text-sm text-gray-600">Gerenciar propostas</p>
                    </div>
                  </Link>

                  <Link
                    href="/meu-perfil"
                    className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="p-3 bg-purple-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Meu Perfil</h3>
                      <p className="text-sm text-gray-600">Editar informações</p>
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
                    className="text-blue-600 hover:text-blue-700 font-medium"
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
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Buscar Novos Projetos
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
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><span className="font-medium">Cliente:</span> {project.client}</p>
                              <p><span className="font-medium">Localização:</span> {project.clientLocation}</p>
                              <p><span className="font-medium">Orçamento:</span> {project.budget}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Prazo:</span> {formatDate(project.deadline)}</p>
                              <p><span className="font-medium">Criado em:</span> {formatDate(project.createdAt)}</p>
                              <p><span className="font-medium">Prazo para proposta:</span> {formatDate(project.proposalDeadline)}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="font-medium text-gray-900 mb-2">Requisitos:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.requirements.map((req, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          {project.myProposal && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                              <p className="font-medium text-gray-900 mb-2">Minha Proposta:</p>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><span className="font-medium">Preço:</span> {project.myProposal.price}</p>
                                  <p><span className="font-medium">Prazo:</span> {project.myProposal.deadline}</p>
                                </div>
                                <div>
                                  <p><span className="font-medium">Enviada em:</span> {formatDate(project.myProposal.submittedAt)}</p>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mt-2">{project.myProposal.message}</p>
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-4">
                          {project.status === 'available' && (
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                              Enviar Proposta
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-700 font-medium">
                            Ver Detalhes
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium">
                            Contatar Cliente
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Minhas Propostas</h2>
                <Link
                  href="/projetos-disponiveis"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Nova Proposta
                </Link>
              </div>

              <div className="grid gap-6">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{proposal.projectTitle}</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p><span className="font-medium">Cliente:</span> {proposal.client}</p>
                            <p><span className="font-medium">Preço:</span> {proposal.price}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Prazo:</span> {proposal.deadline}</p>
                            <p><span className="font-medium">Enviada em:</span> {formatDateTime(proposal.submittedAt)}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="font-medium text-gray-900 mb-1">Mensagem:</p>
                          <p className="text-gray-600 text-sm">{proposal.message}</p>
                        </div>
                        {proposal.clientResponse && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="font-medium text-gray-900 mb-1">Resposta do Cliente:</p>
                            <p className="text-gray-600 text-sm">{proposal.clientResponse}</p>
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProposalStatusColor(proposal.status)}`}>
                        {getProposalStatusText(proposal.status)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Ver Projeto
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 font-medium">
                          Editar Proposta
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

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Meu Portfólio</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Portfólio em desenvolvimento</h3>
                  <p className="text-gray-600 mb-6">
                    Em breve você poderá adicionar fotos dos seus trabalhos e criar um portfólio profissional.
                  </p>
                  <Link
                    href="/editar-perfil"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Editar Perfil
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
