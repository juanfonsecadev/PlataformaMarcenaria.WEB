'use client';

import React from 'react';
import { HowItWorks } from '@/components/HowItWorks';
import { FeaturedSellers } from '@/components/FeaturedSellers';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function dashboardPath(userType: string | undefined) {
  switch (userType) {
    case 'CLIENT':
      return '/dashboard/cliente';
    case 'SELLER':
      return '/dashboard/vendedor';
    case 'CARPENTER':
      return '/dashboard/marceneiro';
    default:
      return '/';
  }
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen">
      <section className="relative h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-900 overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encontre o marceneiro ideal<br />
              para seu projeto sob medida
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              Conectamos clientes e profissionais especializados para
              transformar ideias em móveis únicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {loading ? (
                <div className="h-12 w-40 rounded-lg bg-white/20 animate-pulse" />
              ) : isAuthenticated && user ? (
                <Link href={dashboardPath(user.userType)}>
                  <div className="inline-block bg-white text-teal-800 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg text-lg transition-colors duration-300 shadow-lg cursor-pointer">
                    Ir para meu painel
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/entrar">
                    <div className="inline-block bg-teal-800 hover:bg-teal-900 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                      Entrar
                    </div>
                  </Link>
                  <Link href="/cadastrar">
                    <div className="inline-block bg-white/15 hover:bg-white/25 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors duration-300 cursor-pointer border border-white/30">
                      Criar conta
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <FeaturedSellers />

      <Footer />
    </main>
  );
}
