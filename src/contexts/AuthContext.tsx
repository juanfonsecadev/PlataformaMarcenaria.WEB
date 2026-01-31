'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Controle de modo de desenvolvimento via variável de ambiente.
// Defina `NEXT_PUBLIC_DEV_MODE=true` para manter o comportamento simulado.
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? true : false;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (DEV_MODE) {
        // Modo de desenvolvimento - simula login
        console.log('Modo de desenvolvimento ativo - simulando login');

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          phone: '(11) 99999-9999',
          userType: email.includes('cliente') ? 'CLIENT' : email.includes('vendedor') ? 'SELLER' : email.includes('marceneiro') ? 'CARPENTER' : 'CLIENT',
          active: true,
          rating: 4.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockToken = 'dev_token_' + Date.now();

        localStorage.setItem('jwt_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);

        console.log('Login simulado realizado com sucesso:', mockUser);
        return;
      }

      // Produção: usar authAPI (axios) centralizado em src/lib/api.ts
      const data = await authAPI.login(email, password);

      if (!data || !data.token) {
        throw new Error('Token não recebido do servidor');
      }

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
      setUser(data.user || data);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);

      if (DEV_MODE) {
        // Em modo dev, apenas simular registro (sem login automático)
        await new Promise((resolve) => setTimeout(resolve, 800));
        return;
      }

      // Usar authAPI para criar usuário
      await authAPI.register(userData);
      
      // Não fazer login automático - o usuário será redirecionado para fazer login manualmente
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    setUser(null);
    // Redirecionar para a página de login após logout
    router.push('/entrar');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};