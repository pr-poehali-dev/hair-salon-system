
import { api } from './api';
import { FilterParams, ApiResponse, PaginatedResponse } from './admin-api';

// Тип данных для записи клиента
export interface Appointment {
  id: string | number;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string | number;
  serviceName: string;
  staffId: string | number;
  staffName: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  price: number;
  comments?: string;
  createdAt: string;
}

// Тип данных для создания записи
export interface CreateAppointmentDto {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string | number;
  staffId: string | number;
  date: string;
  time: string;
  comments?: string;
}

// Тип данных для обновления записи
export interface UpdateAppointmentDto {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId?: string | number;
  staffId?: string | number;
  date?: string;
  time?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'canceled';
  comments?: string;
}

// Сервис для работы с записями клиентов
export const appointmentsApi = {
  getAll: (params: FilterParams = {}) => 
    api.get<PaginatedResponse<Appointment>>('/appointments', { 
      body: params 
    }),
  
  getById: (id: string | number) => 
    api.get<ApiResponse<Appointment>>(`/appointments/${id}`),
  
  create: (appointment: CreateAppointmentDto) => 
    api.post<ApiResponse<Appointment>>('/appointments', appointment),
  
  update: (id: string | number, appointment: UpdateAppointmentDto) => 
    api.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointment),
  
  delete: (id: string | number) => 
    api.delete<ApiResponse<null>>(`/appointments/${id}`),
  
  // Изменить статус записи
  changeStatus: (id: string | number, status: Appointment['status']) => 
    api.put<ApiResponse<Appointment>>(`/appointments/${id}/status`, { status }),
  
  // Подтвердить запись
  confirm: (id: string | number) => 
    api.put<ApiResponse<Appointment>>(`/appointments/${id}/confirm`, {}),
  
  // Отменить запись
  cancel: (id: string | number, reason?: string) => 
    api.put<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, { reason }),
};
