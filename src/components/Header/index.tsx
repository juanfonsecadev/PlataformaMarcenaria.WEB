'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Determinar as cores baseadas na rota atual
  const getHeaderColors = () => {
    if (pathname?.includes('/dashboard/cliente')) {
      return {
        bg: isScrolled ? 'bg-teal-700' : 'bg-teal-600',
        logoBg: 'bg-white',
        logoText: isScrolled ? 'text-teal-700' : 'text-teal-600',
        text: 'text-white',
        hover: 'hover:text-gray-200',
        button: 'bg-white/20 text-white hover:bg-white/30'
      };
    }
    if (pathname?.includes('/dashboard/vendedor')) {
      return {
        bg: isScrolled ? 'bg-purple-700' : 'bg-purple-600',
        logoBg: 'bg-white',
        logoText: isScrolled ? 'text-purple-700' : 'text-purple-600',
        text: 'text-white',
        hover: 'hover:text-gray-200',
        button: 'bg-white/20 text-white hover:bg-white/30'
      };
    }
    if (pathname?.includes('/dashboard/marceneiro')) {
      return {
        bg: isScrolled ? 'bg-blue-700' : 'bg-blue-600',
        logoBg: 'bg-white',
        logoText: isScrolled ? 'text-blue-700' : 'text-blue-600',
        text: 'text-white',
        hover: 'hover:text-gray-200',
        button: 'bg-white/20 text-white hover:bg-white/30'
      };
    }
    // Cores padrão (teal) para outras páginas
    return {
      bg: isScrolled ? 'bg-teal-700' : 'bg-teal-600',
      logoBg: 'bg-white',
      logoText: isScrolled ? 'text-teal-700' : 'text-teal-600',
      text: 'text-white',
      hover: 'hover:text-gray-200',
      button: 'bg-white/20 text-white hover:bg-white/30'
    };
  };

  const colors = getHeaderColors();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'CLIENT': return 'Cliente';
      case 'SELLER': return 'Vendedor';
      case 'CARPENTER': return 'Marceneiro';
      default: return 'Usuário';
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${colors.bg} ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded mr-2 flex items-center justify-center transition-colors duration-300 ${colors.logoBg}`}>
                  <span className={`text-sm font-bold transition-colors duration-300 ${colors.logoText}`}>F</span>
                </div>
                <span className={`text-2xl font-bold transition-colors duration-300 ${colors.text}`}>Five Marcenaria</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/sobre-nos" className={`${colors.hover} px-3 py-2 text-sm font-medium transition-colors duration-300 ${colors.text}`}>
              Sobre nós
            </Link>
            <Link href="/como-funciona" className={`${colors.hover} px-3 py-2 text-sm font-medium transition-colors duration-300 ${colors.text}`}>
              Como funciona
            </Link>
            <Link href="/projetos-realizados" className={`${colors.hover} px-3 py-2 text-sm font-medium transition-colors duration-300 ${colors.text}`}>
              Projetos realizados
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-sm font-medium transition-colors duration-300 ${colors.text}`}>
                    {user?.name}
                  </div>
                  <div className={`text-xs transition-colors duration-300 text-gray-200`}>
                    {getUserTypeLabel(user?.userType || '')}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${colors.button}`}
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link href="/entrar" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${colors.text} ${colors.hover}`}>
                  Entrar
                </Link>
                <Link
                  href="/cadastrar"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Solicitar agora
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors duration-300 ${colors.text} ${colors.hover}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/sobre-nos"
                className={`block text-gray-700 px-3 py-2 text-base font-medium ${
                  pathname?.includes('/dashboard/cliente') ? 'hover:text-teal-700' :
                  pathname?.includes('/dashboard/vendedor') ? 'hover:text-purple-700' :
                  pathname?.includes('/dashboard/marceneiro') ? 'hover:text-blue-700' :
                  'hover:text-teal-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre nós
              </Link>
              <Link
                href="/como-funciona"
                className={`block text-gray-700 px-3 py-2 text-base font-medium ${
                  pathname?.includes('/dashboard/cliente') ? 'hover:text-teal-700' :
                  pathname?.includes('/dashboard/vendedor') ? 'hover:text-purple-700' :
                  pathname?.includes('/dashboard/marceneiro') ? 'hover:text-blue-700' :
                  'hover:text-teal-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Como funciona
              </Link>
              <Link
                href="/projetos-realizados"
                className={`block text-gray-700 px-3 py-2 text-base font-medium ${
                  pathname?.includes('/dashboard/cliente') ? 'hover:text-teal-700' :
                  pathname?.includes('/dashboard/vendedor') ? 'hover:text-purple-700' :
                  pathname?.includes('/dashboard/marceneiro') ? 'hover:text-blue-700' :
                  'hover:text-teal-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projetos realizados
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user?.name} ({getUserTypeLabel(user?.userType || '')})
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left text-gray-700 px-3 py-2 text-base font-medium ${
                        pathname?.includes('/dashboard/cliente') ? 'hover:text-teal-700' :
                        pathname?.includes('/dashboard/vendedor') ? 'hover:text-purple-700' :
                        pathname?.includes('/dashboard/marceneiro') ? 'hover:text-blue-700' :
                        'hover:text-teal-700'
                      }`}
                    >
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/entrar"
                    className={`block text-gray-700 px-3 py-2 text-base font-medium ${
                      pathname?.includes('/dashboard/cliente') ? 'hover:text-teal-700' :
                      pathname?.includes('/dashboard/vendedor') ? 'hover:text-purple-700' :
                      pathname?.includes('/dashboard/marceneiro') ? 'hover:text-blue-700' :
                      'hover:text-teal-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastrar"
                    className="block bg-orange-500 text-white px-3 py-2 text-base font-medium rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Solicitar agora
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 