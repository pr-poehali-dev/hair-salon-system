
import { api } from './api';
import { Service, StaffMember } from '@/data/services';
import { Product } from '@/data/products';

// Типы для API запросов
export interface FilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  status?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  message?: string;
  status: string;
}

// Сервис для работы с услугами
export const servicesApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<Service>>('/services', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<Service>>(`/services/${id}`),
  
  create: (service: Partial<Service>) => 
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
  
  create: (product: Partial<Product>) => 
    api.post<ApiResponse<Product>>('/products', product),
  
  update: (id: string | number, product: Partial<Product>) => 
    api.put<ApiResponse<Product>>(`/products/${id}`, product),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/products/${id}`),
  
  // Обновить статус наличия товара
  updateStock: (id: string | number, inStock: boolean) => 
    api.put<ApiResponse<Product>>(`/products/${id}/stock`, { inStock }),
};

// Сервис для работы с персоналом
export const staffApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<StaffMember>>('/staff', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<StaffMember>>(`/staff/${id}`),
  
  create: (staff: Partial<StaffMember>) => 
    api.post<ApiResponse<StaffMember>>('/staff', staff),
  
  update: (id: string | number, staff: Partial<StaffMember>) => 
    api.put<ApiResponse<StaffMember>>(`/staff/${id}`, staff),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/staff/${id}`),
  
  // Получить расписание сотрудника
  getSchedule: (id: string | number, date: string) => 
    api.get<ApiResponse<any>>(`/staff/${id}/schedule`, { 
      body: { date } 
    }),
};

// Сервис для получения статистики для дашборда
export const dashboardApi = {
  getStatistics: () => 
    api.get<ApiResponse<{
      totalProducts: number;
      totalServices: number;
      totalStaff: number;
      inStockProducts: number;
      averageServicePrice: number;
      averageProductPrice: number;
      totalAppointments: number;
      pendingAppointments: number;
    }>>('/dashboard/statistics'),
  
  getRevenueData: (period: string = 'month') => 
    api.get<ApiResponse<any[]>>('/dashboard/revenue', { 
      body: { period } 
    }),
  
  getVisitorsData: (period: string = 'week') => 
    api.get<ApiResponse<any[]>>('/dashboard/visitors', { 
      body: { period } 
    }),
  
  getServicesByCategory: () => 
    api.get<ApiResponse<any[]>>('/dashboard/services-by-category'),
};
