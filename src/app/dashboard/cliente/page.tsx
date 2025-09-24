'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
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

const mockProjects: Project[] = [
  {
    id: 1,
    title: "Cozinha Moderna",
    status: "in_progress",
    carpenter: "João Silva Marcenaria",
    price: "R$ 25.000",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
    description: "Projeto de cozinha moderna com ilha central",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"]
  },
  {
    id: 2,
    title: "Quarto Infantil",
    status: "completed",
    carpenter: "Marcenaria Criativa",
    price: "R$ 18.500",
    createdAt: "2023-12-10",
    updatedAt: "2024-01-20",
    description: "Quarto infantil com tema espacial",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"]
  },
  {
    id: 3,
    title: "Home Office",
    status: "pending",
    carpenter: "Móveis Executivos",
    price: "R$ 32.000",
    createdAt: "2024-02-25",
    updatedAt: "2024-02-25",
    description: "Escritório executivo com mesa ampla",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"]
  }
];

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages'>('overview');

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
                      <p className="text-2xl font-bold text-gray-900">{mockProjects.length}</p>
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
                        {mockProjects.filter(p => p.status === 'completed').length}
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
                        {mockProjects.filter(p => p.status === 'in_progress').length}
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
                      <p className="text-2xl font-bold text-gray-900">R$ 76.000</p>
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
                    href="/perfil"
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
                  {mockProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.carpenter}</p>
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
                {mockProjects.map((project) => (
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
                          <span>Preço: <span className="font-medium text-gray-900">{project.price}</span></span>
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
