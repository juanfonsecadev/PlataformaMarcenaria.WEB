'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { addressAPI, budgetRequestAPI, uploadAPI } from '@/lib/api';

interface ProjectRequest {
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  requirements: string[];
  referenceImages: File[];
}

const categories = [
  'Cozinha',
  'Quarto',
  'Sala',
  'Escritório',
  'Banheiro',
  'Closet',
  'Área Externa',
  'Outros'
];

const budgetRanges = [
  'Até R$ 10.000',
  'R$ 10.000 - R$ 20.000',
  'R$ 20.000 - R$ 35.000',
  'R$ 35.000 - R$ 50.000',
  'R$ 50.000 - R$ 80.000',
  'Acima de R$ 80.000'
];

const commonRequirements = [
  'Madeira maciça',
  'MDF lacado',
  'Acabamento premium',
  'Iluminação LED',
  'Organizadores internos',
  'Pintura especial',
  'Vidro temperado',
  'Ferragens de qualidade'
];

export default function SolicitarProjetoPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    requirements: [],
    referenceImages: []
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProjectRequest(prev => {
        if (parent === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setProjectRequest(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleRequirementToggle = (requirement: string) => {
    setProjectRequest(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProjectRequest(prev => ({
      ...prev,
      referenceImages: [...prev.referenceImages, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setProjectRequest(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Evita envio automático ao trocar para o step 4 (ex: Enter em campos anteriores)
    if (currentStep !== 4) {
      return;
    }

    if (!user) {
      alert('Você precisa estar autenticado para enviar uma solicitação.');
      return;
    }

    setLoading(true);
    
    try {
      const createdAddress = await addressAPI.create({
        ...projectRequest.address,
        userId: user.id,
      });

      let referenceImages: string[] = [];
      if (projectRequest.referenceImages.length > 0) {
        try {
          const uploaded = await uploadAPI.uploadImages(projectRequest.referenceImages);
          referenceImages = uploaded.map((img) => img.url);
        } catch (uploadError) {
          console.warn('Upload de imagens indisponível, enviando apenas nomes dos arquivos.', uploadError);
          referenceImages = projectRequest.referenceImages.map((file) => file.name);
        }
      }

      const estimatedBudget =
        Number(
          projectRequest.budget
            .replace(/[^\d,-]/g, '')
            .replace('.', '')
            .replace(',', '.')
            .split('-')
            .pop()
        ) || undefined;

      const descriptionParts = [
        `Título: ${projectRequest.title}`,
        `Categoria: ${projectRequest.category}`,
        projectRequest.description,
      ];

      if (projectRequest.requirements.length) {
        descriptionParts.push(`Requisitos: ${projectRequest.requirements.join(', ')}`);
      }

      await budgetRequestAPI.create({
        clientId: user.id,
        description: descriptionParts.join('\n'),
        locationId: createdAddress.id,
        estimatedBudget,
        desiredDeadline: projectRequest.deadline ? new Date(projectRequest.deadline).toISOString() : undefined,
        referenceImages,
      });

      alert('Solicitação enviada com sucesso! Você receberá notificações quando vendedores se interessarem pelo seu projeto.');
      
      // Reset form
      setProjectRequest({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        requirements: [],
        referenceImages: []
      });
      setCurrentStep(1);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao enviar solicitação. Tente novamente.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return projectRequest.title && projectRequest.description && projectRequest.category;
      case 2:
        return projectRequest.budget && projectRequest.deadline;
      case 3:
        return projectRequest.address.street && projectRequest.address.number && 
               projectRequest.address.neighborhood && projectRequest.address.city && 
               projectRequest.address.state && projectRequest.address.zipCode;
      case 4:
        return true; // Step 4 is optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white py-16 -mt-20 pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pt-8">
            Solicitar Novo Projeto
          </h1>
          <p className="text-white/90 max-w-3xl">
            Descreva seu projeto e receba propostas dos melhores marceneiros da região
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step ? 'text-teal-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Projeto'}
                    {step === 2 && 'Orçamento'}
                    {step === 3 && 'Endereço'}
                    {step === 4 && 'Detalhes'}
                  </p>
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            
            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalhes do Projeto</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    value={projectRequest.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Ex: Cozinha moderna com ilha central"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={projectRequest.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    value={projectRequest.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Descreva detalhadamente o que você precisa: dimensões, estilo, funcionalidades especiais, etc."
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Budget and Timeline */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Orçamento e Prazo</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa de Orçamento *
                  </label>
                  <select
                    value={projectRequest.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Selecione uma faixa de orçamento</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo Desejado *
                  </label>
                  <input
                    type="date"
                    value={projectRequest.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">💡 Dica</h3>
                  <p className="text-blue-800 text-sm">
                    Seja realista com seu orçamento e prazo. Isso ajuda os marceneiros a enviarem propostas mais adequadas ao seu projeto.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Endereço do Projeto</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.number}
                      onChange={(e) => handleInputChange('address.number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.complement}
                      onChange={(e) => handleInputChange('address.complement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Apartamento, bloco, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.neighborhood}
                      onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="SP, RJ, MG, etc."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={projectRequest.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Requirements and Images */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requisitos e Referências</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Requisitos Especiais (opcional)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {commonRequirements.map((requirement) => (
                      <label key={requirement} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={projectRequest.requirements.includes(requirement)}
                          onChange={() => handleRequirementToggle(requirement)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{requirement}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens de Referência (opcional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  
                  {projectRequest.referenceImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {projectRequest.referenceImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Referência ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">✅ Pronto para enviar!</h3>
                  <p className="text-green-800 text-sm">
                    Sua solicitação será enviada para vendedores da região. Eles entrarão em contato para agendar uma visita técnica.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>

              {currentStep < 4 ? ( //TODO: revisar submit automático ao entrar no step 4 (edge case React + form)
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isStepValid(currentStep)
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className="bg-teal-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
