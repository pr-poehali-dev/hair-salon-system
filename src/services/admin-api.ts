
import { api } from './api';
import { Product } from '@/data/products';
import { Service, StaffMember } from '@/data/services';

// Интерфейсы для API запросов
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Параметры фильтрации и пагинации
export interface FilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// Сервис для работы с услугами
export const servicesApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<Service>>('/services', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<Service>>(`/services/${id}`),
  
  create: (service: Omit<Service, 'id'>) => 
    api.post<ApiResponse<Service>>('/services', service),
  
  update: (id: string | number, service: Partial<Service>) => 
    api.put<ApiResponse<Service>>(`/services/${id}`, service),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/services/${id}`),
};

// Сервис для работы с товарами
export const productsApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<Product>>('/products', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<Product>>(`/products/${id}`),
  
  create: (product: Omit<Product, 'id'>) => 
    api.post<ApiResponse<Product>>('/products', product),
  
  update: (id: string | number, product: Partial<Product>) => 
    api.put<ApiResponse<Product>>(`/products/${id}`, product),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/products/${id}`),
};

// Сервис для работы с персоналом
export const staffApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<StaffMember>>('/staff', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<StaffMember>>(`/staff/${id}`),
  
  create: (staff: Omit<StaffMember, 'id'>) => 
    api.post<ApiResponse<StaffMember>>('/staff', staff),
  
  update: (id: string | number, staff: Partial<StaffMember>) => 
    api.put<ApiResponse<StaffMember>>(`/staff/${id}`, staff),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/staff/${id}`),
};

// Сервис для работы с записями клиентов
export const appointmentsApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<any>>('/appointments', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<any>>(`/appointments/${id}`),
  
  create: (appointment: any) => 
    api.post<ApiResponse<any>>('/appointments', appointment),
  
  update: (id: string | number, appointment: any) => 
    api.put<ApiResponse<any>>(`/appointments/${id}`, appointment),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/appointments/${id}`),
  
  // Дополнительные методы для работы с записями
  approve: (id: string | number) => 
    api.put<ApiResponse<any>>(`/appointments/${id}/approve`, {}),
  
  reject: (id: string | number, reason?: string) => 
    api.put<ApiResponse<any>>(`/appointments/${id}/reject`, { reason }),
};

// Сервис для получения аналитики и статистики
export const analyticsApi = {
  getDashboardData: () => 
    api.get<ApiResponse<any>>('/analytics/dashboard'),
  
  getRevenueStats: (period: 'day' | 'week' | 'month' | 'year' = 'month') => 
    api.get<ApiResponse<any>>(`/analytics/revenue?period=${period}`),
  
  getVisitorsStats: (period: 'day' | 'week' | 'month' | 'year' = 'week') => 
    api.get<ApiResponse<any>>(`/analytics/visitors?period=${period}`),
  
  getServiceCategories: () => 
    api.get<ApiResponse<any>>('/analytics/service-categories'),
};
