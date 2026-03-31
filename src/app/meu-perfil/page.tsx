'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  document?: string;
  userType: 'CLIENT' | 'SELLER' | 'CARPENTER';
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function MeuPerfilPage() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    document: user?.document || '',
    userType: user?.userType || 'CLIENT',
    rating: user?.rating || 0,
    createdAt: user?.createdAt || '',
    updatedAt: user?.updatedAt || '',
  });
  const [loading, setLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setPerfil(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPerfil(prev => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEditSuccess(false);
    try {
      // Simula atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEditSuccess(true);
    } catch {
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Meu Perfil
          </h1>
          <p className="text-white/90 max-w-3xl">
            Visualize e edite suas informações pessoais
          </p>
        </div>
      </section>

      {/* Formulário de edição */}
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Hero */}
          <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
                Meu Perfil
              </h1>
              <p className="text-white/90 max-w-3xl">
                Visualize e edite suas informações pessoais e profissionais
              </p>
            </div>
          </section>

          {/* Formulário de edição */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                  <div className="relative w-24 h-24">
                    <img
                      src={perfil.avatar || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-teal-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 cursor-pointer hover:bg-teal-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">{perfil.name}</h2>
                    <p className="text-gray-600">Tipo: {perfil.userType === 'CLIENT' ? 'Cliente' : perfil.userType === 'SELLER' ? 'Vendedor' : 'Marceneiro'}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 mr-2">★</span>
                      <span className="font-medium text-gray-700">{perfil.rating.toFixed(1)} / 5</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                    <input
                      type="text"
                      value={perfil.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={perfil.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      value={perfil.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                    <input
                      type="text"
                      value={perfil.document || ''}
                      onChange={e => handleInputChange('document', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="CPF ou CNPJ"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-6">Informações da Conta</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário</label>
                    <select
                      value={perfil.userType}
                      onChange={e => handleInputChange('userType', e.target.value as UserProfile['userType'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      disabled
                    >
                      <option value="CLIENT">Cliente</option>
                      <option value="SELLER">Vendedor</option>
                      <option value="CARPENTER">Marceneiro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Cadastro</label>
                    <input
                      type="text"
                      value={perfil.createdAt ? new Date(perfil.createdAt).toLocaleDateString('pt-BR') : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Última Atualização</label>
                    <input
                      type="text"
                      value={perfil.updatedAt ? new Date(perfil.updatedAt).toLocaleDateString('pt-BR') : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
                {editSuccess && (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg text-green-800 text-sm">
                    Perfil atualizado com sucesso!
                  </div>
                )}
              </form>
            </div>
          </section>
        </div>
      </div>
    )};