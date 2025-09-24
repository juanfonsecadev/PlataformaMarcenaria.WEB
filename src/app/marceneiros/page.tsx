'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Carpenter {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  experience: string;
  avatar: string;
  completedProjects: number;
  responseTime: string;
  priceRange: string;
  verified: boolean;
}

const mockCarpenters: Carpenter[] = [
  {
    id: 1,
    name: "João Silva",
    rating: 4.9,
    reviews: 127,
    location: "São Paulo, SP",
    specialties: ["Cozinhas", "Quartos", "Escritórios"],
    experience: "15 anos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    completedProjects: 89,
    responseTime: "2 horas",
    priceRange: "R$ 15.000 - R$ 50.000",
    verified: true
  },
  {
    id: 2,
    name: "Maria Santos",
    rating: 4.8,
    reviews: 95,
    location: "São Paulo, SP",
    specialties: ["Móveis Infantis", "Closets", "Banheiros"],
    experience: "12 anos",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    completedProjects: 67,
    responseTime: "1 hora",
    priceRange: "R$ 10.000 - R$ 35.000",
    verified: true
  },
  {
    id: 3,
    name: "Carlos Mendes",
    rating: 4.7,
    reviews: 78,
    location: "São Paulo, SP",
    specialties: ["Móveis Executivos", "Bibliotecas", "Painéis"],
    experience: "18 anos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    completedProjects: 112,
    responseTime: "3 horas",
    priceRange: "R$ 20.000 - R$ 80.000",
    verified: true
  },
  {
    id: 4,
    name: "Ana Costa",
    rating: 4.6,
    reviews: 56,
    location: "São Paulo, SP",
    specialties: ["Salas", "Área Externa", "Móveis Rústicos"],
    experience: "8 anos",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    completedProjects: 43,
    responseTime: "4 horas",
    priceRange: "R$ 8.000 - R$ 30.000",
    verified: false
  },
  {
    id: 5,
    name: "Roberto Lima",
    rating: 4.9,
    reviews: 143,
    location: "São Paulo, SP",
    specialties: ["Cozinhas Premium", "Móveis Sob Medida", "Restauração"],
    experience: "22 anos",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    completedProjects: 156,
    responseTime: "1 hora",
    priceRange: "R$ 25.000 - R$ 100.000",
    verified: true
  },
  {
    id: 6,
    name: "Fernanda Oliveira",
    rating: 4.5,
    reviews: 34,
    location: "São Paulo, SP",
    specialties: ["Móveis Modernos", "Minimalismo", "Design Contemporâneo"],
    experience: "6 anos",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    completedProjects: 28,
    responseTime: "6 horas",
    priceRange: "R$ 12.000 - R$ 40.000",
    verified: false
  }
];

const specialties = [
  "Cozinhas",
  "Quartos",
  "Salas",
  "Escritórios",
  "Banheiros",
  "Closets",
  "Móveis Infantis",
  "Móveis Executivos",
  "Área Externa",
  "Móveis Rústicos",
  "Móveis Modernos",
  "Restauração"
];

export default function EncontrarMarceneirosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredCarpenters = mockCarpenters
    .filter(carpenter => {
      const matchesSearch = carpenter.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = !selectedSpecialty || carpenter.specialties.includes(selectedSpecialty);
      const matchesLocation = !selectedLocation || carpenter.location.includes(selectedLocation);
      const matchesVerified = !showVerifiedOnly || carpenter.verified;
      
      return matchesSearch && matchesSpecialty && matchesLocation && matchesVerified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'projects':
          return b.completedProjects - a.completedProjects;
        case 'response':
          return parseInt(a.responseTime) - parseInt(b.responseTime);
        case 'price':
          return a.priceRange.localeCompare(b.priceRange);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Encontrar Marceneiros
          </h1>
          <p className="text-white/90 max-w-3xl">
            Conheça os melhores marceneiros da sua região e encontre o profissional ideal para seu projeto
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nome
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome do marceneiro..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidade
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Todas as especialidades</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Todas as localizações</option>
                <option value="São Paulo">São Paulo, SP</option>
                <option value="Rio de Janeiro">Rio de Janeiro, RJ</option>
                <option value="Belo Horizonte">Belo Horizonte, MG</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="rating">Melhor avaliação</option>
                <option value="projects">Mais projetos</option>
                <option value="response">Resposta mais rápida</option>
                <option value="price">Menor preço</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Apenas verificados</span>
            </label>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCarpenters.length} marceneiros encontrados
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarpenters.map((carpenter) => (
              <div key={carpenter.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={carpenter.avatar}
                        alt={carpenter.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{carpenter.name}</h3>
                        <p className="text-sm text-gray-600">{carpenter.location}</p>
                        {carpenter.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            ✓ Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {renderStars(carpenter.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {carpenter.rating} ({carpenter.reviews} avaliações)
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Experiência:</span>
                      <span className="font-medium">{carpenter.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projetos:</span>
                      <span className="font-medium">{carpenter.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resposta:</span>
                      <span className="font-medium">{carpenter.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço:</span>
                      <span className="font-medium">{carpenter.priceRange}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {carpenter.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200">
                      Ver Perfil
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
                      Contatar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCarpenters.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum marceneiro encontrado</h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros para encontrar mais profissionais.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('');
                  setSelectedLocation('');
                  setShowVerifiedOnly(false);
                }}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
