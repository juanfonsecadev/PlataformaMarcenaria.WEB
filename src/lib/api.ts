import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8080/api';

// Instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/entrar';
    }
    return Promise.reject(error);
  }
);

// Tipos baseados nas entidades da API
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: 'CLIENT' | 'SELLER' | 'CARPENTER';
  avatar?: string;
  document?: string;
  active: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'CLIENT' | 'SELLER' | 'CARPENTER';
  document?: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: 'CLIENT' | 'SELLER' | 'CARPENTER';
  avatar?: string;
  document?: string;
  active: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BudgetRequest {
  id: number;
  client: User;
  description: string;
  referenceImages: string[];
  status: 'OPEN' | 'WAITING_VISIT' | 'WAITING_BIDS' | 'CLOSED' | 'CANCELLED';
  location: Address;
  estimatedBudget?: number;
  desiredDeadline?: string;
  visits: Visit[];
  bids: Bid[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetRequestCreateDTO {
  description: string;
  referenceImages?: string[];
  locationId: number;
  estimatedBudget?: number;
  desiredDeadline?: string;
}

export interface Visit {
  id: number;
  budgetRequest: BudgetRequest;
  seller: User;
  scheduledDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: number;
  budgetRequest: BudgetRequest;
  carpenter: User;
  price: number;
  estimatedDuration: string;
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// Funções da API
export const authAPI = {
  // Login (você precisará implementar este endpoint na API)
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Registro
  register: async (userData: UserCreateDTO) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Obter usuário atual
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export const userAPI = {
  // Criar usuário
  create: async (userData: UserCreateDTO) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Obter usuário por ID
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Obter todos os usuários
  getAll: async (userType?: string) => {
    const params = userType ? { userType } : {};
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Atualizar usuário
  update: async (id: number, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deletar usuário
  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};

export const budgetRequestAPI = {
  // Criar solicitação de orçamento
  create: async (budgetData: BudgetRequestCreateDTO) => {
    const response = await api.post('/budget-requests', budgetData);
    return response.data;
  },

  // Obter solicitação por ID
  getById: async (id: number) => {
    const response = await api.get(`/budget-requests/${id}`);
    return response.data;
  },

  // Obter solicitações por cliente
  getByClientId: async (clientId: number) => {
    const response = await api.get(`/budget-requests/client/${clientId}`);
    return response.data;
  },

  // Obter solicitações por status
  getByStatus: async (status: string) => {
    const response = await api.get(`/budget-requests/status/${status}`);
    return response.data;
  },

  // Obter solicitações por localização
  getByLocation: async (city: string, state: string) => {
    const response = await api.get('/budget-requests/location', {
      params: { city, state }
    });
    return response.data;
  },

  // Atualizar status
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/budget-requests/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Deletar solicitação
  delete: async (id: number) => {
    await api.delete(`/budget-requests/${id}`);
  },
};

export const visitAPI = {
  // Criar visita
  create: async (visitData: Partial<Visit>) => {
    const response = await api.post('/visits', visitData);
    return response.data;
  },

  // Obter visita por ID
  getById: async (id: number) => {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },

  // Atualizar visita
  update: async (id: number, visitData: Partial<Visit>) => {
    const response = await api.put(`/visits/${id}`, visitData);
    return response.data;
  },

  // Deletar visita
  delete: async (id: number) => {
    await api.delete(`/visits/${id}`);
  },
};

export const bidAPI = {
  // Criar proposta
  create: async (bidData: Partial<Bid>) => {
    const response = await api.post('/bids', bidData);
    return response.data;
  },

  // Obter proposta por ID
  getById: async (id: number) => {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  },

  // Atualizar proposta
  update: async (id: number, bidData: Partial<Bid>) => {
    const response = await api.put(`/bids/${id}`, bidData);
    return response.data;
  },

  // Deletar proposta
  delete: async (id: number) => {
    await api.delete(`/bids/${id}`);
  },
};

export const addressAPI = {
  // Criar endereço
  create: async (addressData: Partial<Address>) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Obter endereço por ID
  getById: async (id: number) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  // Atualizar endereço
  update: async (id: number, addressData: Partial<Address>) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Deletar endereço
  delete: async (id: number) => {
    await api.delete(`/addresses/${id}`);
  },
};
