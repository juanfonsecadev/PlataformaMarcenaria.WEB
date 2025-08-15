'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type RoleKey = 'cliente' | 'marceneiro' | 'vendedor';

const roleConfigs: Record<RoleKey, {
  title: string;
  intro: string;
  steps: { title: string; description: string; }[];
  cta: { label: string; href: string };
}> = {
  cliente: {
    title: 'Como Funciona para o Cliente',
    intro: 'Solicite seu serviço, receba visitas técnicas, projetos detalhados e compare as melhores propostas com segurança e transparência.',
    steps: [
      { title: 'Solicitação do serviço', description: 'Informe o que você precisa. É necessário cadastro para prosseguir.' },
      { title: 'Visita técnica e projeto', description: 'Um vendedor parceiro visita seu endereço para medir e criar o projeto detalhado (2D/3D e lista de materiais). Agendamento realizado pela plataforma.' },
      { title: 'Publicação do projeto', description: 'Seu projeto é publicado e marceneiros cadastrados podem enviar propostas.' },
      { title: 'Comparação e escolha', description: 'Compare propostas, avalie perfis e escolha o marceneiro ideal.' },
      { title: 'Pagamento seguro', description: 'Pague pela plataforma. O valor é repassado ao marceneiro após a conclusão aprovada.' },
      { title: 'Acompanhamento online', description: 'Acompanhe o andamento, converse diretamente com o marceneiro e com o vendedor.' },
    ],
    cta: { label: 'Começar agora', href: '/cadastrar' }
  },
  marceneiro: {
    title: 'Como Funciona para o Marceneiro',
    intro: 'Encontre projetos alinhados ao seu perfil, envie propostas competitivas e receba com segurança após a entrega aprovada.',
    steps: [
      { title: 'Cadastro profissional', description: 'Crie seu perfil com especialidades, experiência, localização e portfólio.' },
      { title: 'Busca de projetos', description: 'Encontre projetos por tipo de móvel, localização e faixa de preço.' },
      { title: 'Envio de propostas', description: 'Apresente preço, prazo e forma de pagamento. Tire dúvidas com o cliente.' },
      { title: 'Aceite e execução', description: 'Ao ser escolhido, inicie a produção conforme o projeto aprovado.' },
      { title: 'Pagamento garantido', description: 'Receba o pagamento através da plataforma após a aprovação do cliente.' },
    ],
    cta: { label: 'Quero me cadastrar', href: '/cadastrar' }
  },
  vendedor: {
    title: 'Como Funciona para o Vendedor',
    intro: 'Profissionais e parceiros responsáveis por visitas técnicas e elaboração de projetos para publicação na plataforma.',
    steps: [
      { title: 'Cadastro de vendedor', description: 'Apresente seu portfólio, especializações e experiência em vendas.' },
      { title: 'Recebimento de solicitações', description: 'Receba chamados de clientes para criação de projetos.' },
      { title: 'Visita técnica', description: 'Agende e realize a visita para medições e levantamento de necessidades.' },
      { title: 'Projeto e publicação', description: 'Desenvolva o projeto (2D/3D, lista de materiais) e publique na plataforma.' },
      { title: 'Remuneração do vendedor', description: 'Receba pelo serviço conforme regras de pagamento definidas pela plataforma.' },
    ],
    cta: { label: 'Ser parceiro vendedor', href: '/cadastrar' }
  }
};

export default function ComoFuncionaPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>('cliente');
  const { title, intro, steps, cta } = roleConfigs[activeRole];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Como Funciona</h1>
          <p className="text-white/90 max-w-3xl">
            Entenda o passo a passo para Cliente, Marceneiro e Vendedor.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3">
          {(['cliente','marceneiro','vendedor'] as RoleKey[]).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeRole === role ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role === 'cliente' && 'Cliente'}
              {role === 'marceneiro' && 'Marceneiro'}
              {role === 'vendedor' && 'Vendedor'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-800 mb-3">{title}</h2>
            <p className="text-gray-600 mb-8">{intro}</p>

            <ol className="grid md:grid-cols-2 gap-6">
              {steps.map((step, idx) => (
                <li key={idx} className="relative bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold mr-4">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link href={cta.href} className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                {cta.label}
              </Link>
              {activeRole === 'cliente' && (
                <div className="text-sm text-gray-500">
                  Dica: O agendamento da visita técnica é feito pela própria plataforma após a solicitação.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
