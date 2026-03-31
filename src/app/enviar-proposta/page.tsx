'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bidAPI, budgetRequestAPI, BudgetRequest } from '@/lib/api';

function EnviarPropostaInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const budgetRequestIdParam = searchParams.get('budgetRequestId');
  const budgetRequestId = budgetRequestIdParam ? Number(budgetRequestIdParam) : 0;

  const [br, setBr] = useState<BudgetRequest | null>(null);
  const [price, setPrice] = useState('');
  const [days, setDays] = useState('30');
  const [description, setDescription] = useState('');
  const [loadingBr, setLoadingBr] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    if (!budgetRequestId || authLoading || !user || user.userType !== 'CARPENTER') return;
    const load = async () => {
      try {
        setLoadingBr(true);
        const data = await budgetRequestAPI.getById(budgetRequestId);
        setBr(data);
      } catch {
        setBr(null);
        setError('Não foi possível carregar o projeto.');
      } finally {
        setLoadingBr(false);
      }
    };
    load();
  }, [budgetRequestId, authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 'CARPENTER' || !br) return;
    if (br.status !== 'WAITING_BIDS') {
      setError('Este projeto ainda não está aceitando propostas.');
      return;
    }
    const priceNum = Number(price.replace(/\./g, '').replace(',', '.'));
    const d = Number(days);
    if (!priceNum || priceNum <= 0) {
      setError('Informe um preço válido.');
      return;
    }
    if (!d || d < 1) {
      setError('Informe o prazo em dias (mínimo 1).');
      return;
    }
    if (!description.trim()) {
      setError('Descreva sua proposta.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await bidAPI.create({
        carpenterId: user.id,
        budgetRequestId: br.id,
        price: priceNum,
        executionTimeInDays: d,
        description: description.trim(),
      });
      router.push('/minhas-propostas');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível enviar a proposta.');
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

  if (user.userType !== 'CARPENTER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-700 to-cyan-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Enviar proposta</h1>
          <p className="text-white/85 text-sm">Projeto #{budgetRequestId || '—'}</p>
          <Link href="/projetos-disponiveis" className="inline-block mt-4 text-sm text-white/90 underline">
            ← Voltar aos projetos
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingBr && <p className="text-gray-600 text-sm">Carregando projeto...</p>}
          {!loadingBr && !br && (
            <p className="text-gray-600 text-sm">Projeto não encontrado.</p>
          )}
          {br && (
            <>
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Status: {br.status}
                </p>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{br.description}</p>
                {br.status !== 'WAITING_BIDS' && (
                  <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Só é possível enviar proposta quando o projeto estiver em fase de licitação (após a visita
                    técnica ser concluída pelo vendedor).
                  </p>
                )}
              </div>
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$) *</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="28000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de execução (dias) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da proposta *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Materiais, diferenciais, garantias..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || br.status !== 'WAITING_BIDS'}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar proposta'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function EnviarPropostaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600 text-sm">Carregando...</p>
        </div>
      }
    >
      <EnviarPropostaInner />
    </Suspense>
  );
}
