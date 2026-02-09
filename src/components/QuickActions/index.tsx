'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const QuickActions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const actions = [
    { title: 'Solicitar Projeto', href: '/solicitar-projeto', icon: '📝' },
    { title: 'Marceneiros', href: '/marceneiros', icon: '🔍' },
    { title: 'Projetos', href: '/projetos-realizados', icon: '📁' },
    { title: 'Sobre', href: '/sobre-nos', icon: 'ℹ️' }
  ];

  return (
    <div>
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          aria-label="Ações rápidas"
          className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg flex items-center justify-center text-2xl transition-colors"
        >
          {open ? '✕' : '⚡'}
        </button>
      </div>

      {/* Modal / panel */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-80">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b">
              <div className="text-sm font-semibold">Ações rápidas</div>
              <div className="text-xs text-gray-500">Acesse funcionalidades com um clique</div>
            </div>

            <div className="p-3">
              <div className="space-y-2">
                {actions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">{a.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{a.title}</div>
                  </Link>
                ))}

                {isAuthenticated ? (
                  <Link
                    href={user?.userType === 'CLIENT' ? '/dashboard/cliente' : user?.userType === 'SELLER' ? '/dashboard/vendedor' : '/dashboard/marceneiro'}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">👤</div>
                    <div className="text-sm font-medium text-gray-700">Ir para o dashboard</div>
                  </Link>
                ) : (
                  <Link
                    href="/entrar"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-lg">🔑</div>
                    <div className="text-sm font-medium text-gray-700">Entrar</div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
