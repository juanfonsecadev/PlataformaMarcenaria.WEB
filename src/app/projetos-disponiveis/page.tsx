'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { budgetRequestAPI, BudgetRequest } from '@/lib/api';

function formatMoney(v?: number | null) {
  if (v == null) return 'A combinar';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function statusLabel(s: BudgetRequest['status']) {
  switch (s) {
    case 'OPEN':
      return 'Aberto — aguardando visita';
    case 'WAITING_VISIT':
      return 'Visita agendada';
    case 'WAITING_BIDS':
      return 'Aceitando propostas';
    case 'CLOSED':
      return 'Encerrado';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return s;
  }
}

export default function ProjetosDisponiveisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/entrar');
      return;
    }
    if (user.userType === 'CLIENT') {
      router.replace('/dashboard/cliente');
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError('');
        if (user.userType === 'SELLER') {
          const data = await budgetRequestAPI.getByStatus('OPEN');
          setItems(data);
        } else {
          const [open, waitingBids] = await Promise.all([
            budgetRequestAPI.getByStatus('OPEN'),
            budgetRequestAPI.getByStatus('WAITING_BIDS'),
          ]);
          const map = new Map<number, BudgetRequest>();
          [...open, ...waitingBids].forEach((br) => map.set(br.id, br));
          setItems(Array.from(map.values()).sort((a, b) => a.id - b.id));
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Não foi possível carregar os projetos.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user, authLoading, router]);

  const title = useMemo(() => {
    if (user?.userType === 'SELLER') return 'Projetos abertos (visita técnica)';
    return 'Projetos disponíveis';
  }, [user?.userType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16 -mt-20 pt-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/85 text-sm md:text-base max-w-2xl">
            {user?.userType === 'SELLER' &&
              'Solicitações com status aberto: você pode agendar uma visita técnica.'}
            {user?.userType === 'CARPENTER' &&
              'Projetos abertos ou já em fase de propostas. Envie lances apenas quando o status estiver “aceitando propostas”.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={
                user?.userType === 'SELLER'
                  ? '/dashboard/vendedor'
                  : '/dashboard/marceneiro'
              }
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium"
            >
              ← Voltar ao dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {loading && <p className="text-gray-600 text-sm">Carregando...</p>}
          {!loading && items.length === 0 && (
            <p className="text-gray-600">Nenhum projeto encontrado no momento.</p>
          )}
          <div className="space-y-4">
            {!loading &&
              items.map((br) => (
                <article
                  key={br.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        #{br.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                        {statusLabel(br.status)}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm whitespace-pre-wrap break-words line-clamp-4">
                      {br.description}
                    </p>
                    <p className="mt-3 text-xs text-gray-500">
                      Cliente: {br.client?.name ?? '—'} · {br.location?.city}/{br.location?.state}
                    </p>
                    <p className="text-xs text-gray-500">
                      Orçamento estimado: {formatMoney(br.estimatedBudget)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    {user?.userType === 'SELLER' && br.status === 'OPEN' && (
                      <Link
                        href={`/nova-visita?budgetRequestId=${br.id}`}
                        className="text-center px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                      >
                        Agendar visita
                      </Link>
                    )}
                    {user?.userType === 'CARPENTER' && br.status === 'WAITING_BIDS' && (
                      <Link
                        href={`/enviar-proposta?budgetRequestId=${br.id}`}
                        className="text-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                      >
                        Enviar proposta
                      </Link>
                    )}
                    {user?.userType === 'CARPENTER' && br.status === 'OPEN' && (
                      <span className="text-xs text-gray-500 text-center md:text-right">
                        Após a visita do vendedor, este projeto passará a aceitar propostas.
                      </span>
                    )}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
