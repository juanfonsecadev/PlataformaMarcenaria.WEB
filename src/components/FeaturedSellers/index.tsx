'use client';

import React, { useEffect, useState } from 'react';
import { userAPI, User } from '@/lib/api';

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        } else {
          return (
            <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
      })}
    </div>
  );
};

export const FeaturedSellers = () => {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await userAPI.getPublicByType('SELLER');
        setSellers(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch {
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
            Vendedores em destaque
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Profissionais cadastrados na plataforma (dados reais do banco).
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500 text-sm">Carregando vendedores...</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {!loading &&
            sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center"
              >
                <div className="mb-4">
                  <div className="w-20 h-20 bg-teal-100 rounded-full mx-auto mb-3 flex items-center justify-center text-teal-700 text-2xl font-bold">
                    {seller.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{seller.name}</h3>
                  <div className="flex justify-center mb-2">
                    <StarRating rating={seller.rating ?? 0} />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{seller.phone}</p>
                </div>
              </div>
            ))}
        </div>

        {!loading && sellers.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            Ainda não há vendedores cadastrados.
          </p>
        )}
      </div>
    </section>
  );
};
