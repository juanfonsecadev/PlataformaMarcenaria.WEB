'use client';

import React from 'react';
import Link from 'next/link';

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">Sobre Nós</h1>
          <p className="text-white/90 max-w-3xl">
            Conectando sonhos com realidade através da marcenaria de qualidade
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
              <p className="text-lg text-gray-600 mb-6">
                A Five Marcenaria nasceu da paixão por transformar ideias em móveis únicos e funcionais. 
                Fundada em 2020, nossa plataforma revolucionou o mercado de marcenaria ao conectar clientes, 
                vendedores e marceneiros em um ambiente seguro e transparente.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Acreditamos que cada projeto conta uma história única. Por isso, desenvolvemos uma 
                plataforma que facilita todo o processo, desde a concepção até a entrega final, 
                garantindo qualidade, segurança e satisfação para todos os envolvidos.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  +500 Projetos Realizados
                </div>
                <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  +200 Marceneiros Parceiros
                </div>
                <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  98% Satisfação
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-teal-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Projetos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-teal-600 mb-1">200+</div>
                  <div className="text-sm text-gray-600">Marceneiros</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-teal-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Satisfação</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-teal-600 mb-1">24h</div>
                  <div className="text-sm text-gray-600">Suporte</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Pilares</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os valores que guiam nossa jornada e definem nossa identidade
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Conectar clientes, vendedores e marceneiros através de uma plataforma 
                segura e transparente, transformando ideias em móveis únicos com 
                qualidade excepcional.
              </p>
            </div>

            {/* Visão */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a principal referência em plataformas de marcenaria no Brasil, 
                reconhecida pela excelência, inovação e satisfação de todos os 
                participantes do ecossistema.
              </p>
            </div>

            {/* Valores */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Valores</h3>
              <p className="text-gray-600">
                Transparência, qualidade, segurança, inovação e respeito. 
                Valores que permeiam cada projeto e cada relacionamento 
                construído em nossa plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funcionamos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funcionamos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um processo simples e seguro para todos os participantes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cliente Solicita</h3>
              <p className="text-gray-600">
                O cliente descreve seu projeto e recebe visitas técnicas para 
                elaboração do projeto detalhado.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Marceneiros Propostam</h3>
              <p className="text-gray-600">
                Marceneiros cadastrados enviam propostas competitivas baseadas 
                no projeto elaborado pelos vendedores.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Projeto Executado</h3>
              <p className="text-gray-600">
                O cliente escolhe a melhor proposta e acompanha a execução 
                com pagamento seguro pela plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Equipe</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profissionais dedicados a tornar sua experiência única
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">A</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ana Silva</h3>
              <p className="text-teal-600 font-medium mb-4">CEO & Fundadora</p>
              <p className="text-gray-600 text-sm">
                Mais de 15 anos de experiência em tecnologia e inovação. 
                Apaixonada por conectar pessoas através de soluções digitais.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carlos Mendes</h3>
              <p className="text-teal-600 font-medium mb-4">CTO</p>
              <p className="text-gray-600 text-sm">
                Especialista em desenvolvimento de plataformas escaláveis. 
                Responsável pela arquitetura técnica da nossa solução.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marina Costa</h3>
              <p className="text-teal-600 font-medium mb-4">Head de Operações</p>
              <p className="text-gray-600 text-sm">
                Experiência em gestão de projetos e relacionamento com clientes. 
                Garante a excelência em cada etapa do processo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para fazer parte da nossa história?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de clientes e profissionais que já transformaram 
            seus projetos em realidade através da nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cadastrar"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Começar Agora
            </Link>
            <Link 
              href="/como-funciona"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-teal-600 transition-colors duration-200"
            >
              Como Funciona
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
