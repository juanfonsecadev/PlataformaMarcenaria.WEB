'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { userAPI, User } from '@/lib/api';

export default function EncontrarMarceneirosPage() {
  const [carpenters, setCarpenters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getPublicByType('CARPENTER');
        setCarpenters(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Não foi possível carregar os marceneiros.');
        setCarpenters([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = carpenters.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
    return list;
  }, [carpenters, searchTerm, sortBy]);

  const renderStars = (rating: number) => {
    const r = Math.min(5, Math.max(0, rating));
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(r) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Encontrar Marceneiros
          </h1>
          <p className="text-white/90 max-w-3xl">
            Profissionais cadastrados na plataforma. Entre em contato pelo telefone informado no perfil.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="rating">Melhor avaliação</option>
                <option value="name">Nome (A–Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}
          {loading && <p className="text-gray-600 mb-8">Carregando marceneiros...</p>}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filtered.length} marceneiro{filtered.length === 1 ? '' : 's'} encontrado
              {filtered.length === 1 ? '' : 's'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((carpenter) => (
              <div
                key={carpenter.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                        {carpenter.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{carpenter.name}</h3>
                        <p className="text-sm text-gray-600">{carpenter.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">{renderStars(carpenter.rating ?? 0)}</div>
                    <span className="ml-2 text-sm text-gray-600">
                      {(carpenter.rating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>E-mail</span>
                      <span className="font-medium text-right truncate max-w-[60%]">{carpenter.email}</span>
                    </div>
                    {carpenter.document && (
                      <div className="flex justify-between">
                        <span>Documento</span>
                        <span className="font-medium">{carpenter.document}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum marceneiro encontrado</h3>
              <p className="text-gray-600">Cadastre marceneiros na API ou ajuste a busca.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
