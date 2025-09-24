'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/api'; // Certifique-se de que o UserType está definido aqui
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

// URL base da sua API
const API_BASE_URL = 'http://localhost:8080/api';

// Modo de desenvolvimento - simula login sem backend
const DEV_MODE = true; // Mude para false quando o backend estiver funcionando

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados baseados no email
        const mockUser: User = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          phone: '(11) 99999-9999',
          userType: email.includes('cliente') ? 'CLIENT' : 
                   email.includes('vendedor') ? 'SELLER' : 
                   email.includes('marceneiro') ? 'CARPENTER' : 'CLIENT',
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
      
      // Modo produção - chama API real
      console.log('Tentando fazer login com:', { email, API_BASE_URL });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        let errorMessage = 'Erro no login.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Erro detalhado:', errorData);
        } catch (parseError) {
          console.error('Erro ao fazer parse do erro:', parseError);
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Login successful, data:', data);
      
      // Verificar se o token existe na resposta
      if (!data.token) {
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
      const response = await fetch(`${API_BASE_URL}/users`, { // O seu endpoint POST para criar usuário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no registro.');
      }
      
      const data = await response.json();
      // Após o registro, você pode logar o usuário
      await login(userData.email, userData.password); 
      
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