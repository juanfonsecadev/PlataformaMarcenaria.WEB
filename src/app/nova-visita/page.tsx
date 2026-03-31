'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { visitAPI } from '@/lib/api';

function NovaVisitaInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetRequestIdParam = searchParams.get('budgetRequestId');

  const [scheduledLocal, setScheduledLocal] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 'SELLER') return;
    const budgetRequestId = Number(budgetRequestIdParam);
    if (!budgetRequestId) {
      setError('Selecione um projeto em Projetos disponíveis.');
      return;
    }
    if (!scheduledLocal) {
      setError('Informe data e horário da visita.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const scheduledDate = new Date(scheduledLocal).toISOString();
      await visitAPI.create({
        sellerId: user.id,
        budgetRequestId,
        scheduledDate,
        notes: notes.trim() || undefined,
      });
      router.push('/dashboard/vendedor');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível agendar a visita.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    );
  }

  if (user.userType !== 'SELLER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Agendar visita técnica</h1>
          <p className="text-white/85 text-sm">
            Projeto #{budgetRequestIdParam || '—'}
          </p>
          <Link href="/projetos-disponiveis" className="inline-block mt-4 text-sm text-white/90 underline">
            ← Voltar aos projetos
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {!budgetRequestIdParam && (
            <p className="text-gray-600 mb-4 text-sm">
              Abra um projeto em{' '}
              <Link href="/projetos-disponiveis" className="text-purple-600 font-medium">
                Projetos disponíveis
              </Link>{' '}
              e clique em &quot;Agendar visita&quot;.
            </p>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data e horário *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledLocal}
                onChange={(e) => setScheduledLocal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Ex.: levar fita métrica, confirmar acesso ao local..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !budgetRequestIdParam}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Confirmar agendamento'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function NovaVisitaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600 text-sm">Carregando...</p>
        </div>
      }
    >
      <NovaVisitaInner />
    </Suspense>
  );
}
