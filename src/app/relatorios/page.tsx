'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { budgetRequestAPI, visitAPI } from '@/lib/api';

export default function RelatoriosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [openCount, setOpenCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/entrar');
      return;
    }
    if (user.userType !== 'SELLER') {
      if (user.userType === 'CARPENTER') router.replace('/dashboard/marceneiro');
      else router.replace('/dashboard/cliente');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.userType !== 'SELLER') return;
    const run = async () => {
      try {
        setLoading(true);
        const [open, visits] = await Promise.all([
          budgetRequestAPI.getByStatus('OPEN'),
          visitAPI.getBySellerId(user.id),
        ]);
        setOpenCount(Array.isArray(open) ? open.length : 0);
        setVisitsCount(Array.isArray(visits) ? visits.length : 0);
      } catch {
        setOpenCount(0);
        setVisitsCount(0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  if (authLoading || !user || user.userType !== 'SELLER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
          <p className="text-white/85 text-sm">Resumo rápido da sua atuação como vendedor.</p>
          <Link href="/dashboard/vendedor" className="inline-block mt-4 text-sm text-white/90 underline">
            ← Voltar ao dashboard
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600">Projetos abertos (oportunidade de visita)</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : openCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600">Visitas registradas (total)</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? '...' : visitsCount}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
