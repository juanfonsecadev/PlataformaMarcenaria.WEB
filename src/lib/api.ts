import axios from 'axios';

// Configuração base da API
// Use `NEXT_PUBLIC_API_BASE_URL` para sobrescrever em tempo de build/execução.
// Por exemplo: `http://localhost:5000` ou `https://localhost:5001`.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

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
      const url = String(error.config?.url ?? '');
      // Não deslogar ao falhar login/registro (401/400 nesses endpoints)
      if (url.includes('/auth/login') || url.includes('/auth/register')) {
        return Promise.reject(error);
      }
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/entrar')) {
        window.location.href = '/entrar';
      }
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

export interface AddressCreateDTO {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  userId: number;
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
  clientId: number;
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

export interface UploadImageResponseDTO {
  id: number;
  url: string;
  uploadedAt: string;
}

export interface VisitCreateDTO {
  sellerId: number;
  budgetRequestId: number;
  scheduledDate: string;
  notes?: string;
}

export interface BidCreateDTO {
  carpenterId: number;
  budgetRequestId: number;
  price: number;
  executionTimeInDays: number;
  description: string;
}

// Funções da API
export const authAPI = {
  // Login (você precisará implementar este endpoint na API)
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    if (data?.token || data?.Token) {
      return {
        ...data,
        token: data.token ?? data.Token,
      };
    }
    return data;
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

  /** Listagem pública (sem JWT) por tipo — usado na home e página de marceneiros */
  getPublicByType: async (userType: 'CLIENT' | 'SELLER' | 'CARPENTER') => {
    const response = await api.get('/users/public', { params: { userType } });
    return response.data as User[];
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
  create: async (visitData: VisitCreateDTO) => {
    const response = await api.post('/visits', visitData);
    return response.data;
  },

  // Obter visita por ID
  getById: async (id: number) => {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },

  // Obter visitas por vendedor
  getBySellerId: async (sellerId: number) => {
    const response = await api.get(`/visits/seller/${sellerId}`);
    return response.data;
  },

  // Obter visitas por solicitação de orçamento
  getByBudgetRequestId: async (budgetRequestId: number) => {
    const response = await api.get(`/visits/budget-request/${budgetRequestId}`);
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

  updateStatus: async (id: number, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => {
    const response = await api.patch(`/visits/${id}/status`, null, { params: { status } });
    return response.data;
  },
};

export const bidAPI = {
  // Criar proposta
  create: async (bidData: BidCreateDTO) => {
    const response = await api.post('/bids', bidData);
    return response.data;
  },

  // Obter proposta por ID
  getById: async (id: number) => {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  },

  // Obter propostas por marceneiro
  getByCarpenterId: async (carpenterId: number) => {
    const response = await api.get(`/bids/carpenter/${carpenterId}`);
    return response.data;
  },

  // Obter propostas por solicitação de orçamento
  getByBudgetRequestId: async (budgetRequestId: number) => {
    const response = await api.get(`/bids/budget-request/${budgetRequestId}`);
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
  create: async (addressData: AddressCreateDTO) => {
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

export const uploadAPI = {
  uploadImages: async (files: File[]): Promise<UploadImageResponseDTO[]> => {
    if (!files.length) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await api.post('/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
