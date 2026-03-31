'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bidAPI } from '@/lib/api';

export default function MinhasPropostasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/entrar');
      return;
    }
    if (user.userType !== 'CARPENTER') {
      if (user.userType === 'SELLER') router.replace('/dashboard/vendedor');
      else router.replace('/dashboard/cliente');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.userType !== 'CARPENTER') return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await bidAPI.getByCarpenterId(user.id);
        setBids(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Erro ao carregar propostas.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  if (authLoading || !user || user.userType !== 'CARPENTER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-700 to-cyan-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Minhas propostas</h1>
            <p className="text-white/85 text-sm">Acompanhe o status dos seus lances.</p>
          </div>
          <Link
            href="/projetos-disponiveis"
            className="text-sm text-white/90 underline"
          >
            Buscar projetos →
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {loading && <p className="text-gray-600 text-sm">Carregando...</p>}
          {!loading && bids.length === 0 && (
            <p className="text-gray-600">Você ainda não enviou propostas.</p>
          )}
          <div className="space-y-4">
            {!loading &&
              bids.map((b) => (
                <article
                  key={b.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      Projeto #{b.budgetRequest?.id ?? '—'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Valor:{' '}
                    {typeof b.price === 'number'
                      ? b.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : b.price}
                  </p>
                  {b.executionTimeInDays != null && (
                    <p className="text-sm text-gray-600">Prazo: {b.executionTimeInDays} dias</p>
                  )}
                  {b.description && (
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{b.description}</p>
                  )}
                </article>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
