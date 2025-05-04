
import { authService } from './auth';

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/v1';

// Интерфейс для опций запроса
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

// Обработчик ошибок API
const handleApiError = async (response: Response) => {
  try {
    const errorData = await response.json();
    // Если токен истек, пробуем обновить его и повторить запрос
    if (response.status === 401 && errorData?.message?.includes('token')) {
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        return { retry: true };
      }
    }
    
    return {
      status: response.status,
      message: errorData.message || 'Произошла ошибка при выполнении запроса',
      errors: errorData.errors,
    };
  } catch (error) {
    return {
      status: response.status,
      message: `Ошибка ${response.status}: ${response.statusText}`,
    };
  }
};

// Функция для выполнения запросов к API
async function fetchWithAuth(
  url: string,
  method: string,
  options: RequestOptions = {},
  retryCount = 0
) {
  // Если количество попыток повторного запроса превышает максимальное, выбрасываем ошибку
  if (retryCount > 1) {
    throw new Error('Превышено максимальное количество попыток повторного запроса');
  }
  
  // Получаем токен доступа из сервиса авторизации
  const token = authService.getAccessToken();
  
  // Настраиваем заголовки
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  // Если есть токен, добавляем его в заголовки
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Настраиваем опции запроса
  const requestOptions: RequestInit = {
    method,
    headers,
  };
  
  // Если есть тело запроса, добавляем его
  if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestOptions.body = JSON.stringify(options.body);
  }
  
  try {
    const fullUrl = options.body && method === 'GET' 
      ? `${API_BASE_URL}${url}?${new URLSearchParams(options.body as Record<string, string>).toString()}`
      : `${API_BASE_URL}${url}`;
    
    // Выполняем запрос
    const response = await fetch(fullUrl, requestOptions);
    
    // Если запрос успешен, возвращаем ответ
    if (response.ok) {
      return await response.json();
    }
    
    // Обрабатываем ошибку
    const errorResult = await handleApiError(response);
    
    // Если нужно повторить запрос (например, после обновления токена)
    if (errorResult.retry) {
      return fetchWithAuth(url, method, options, retryCount + 1);
    }
    
    throw errorResult;
  } catch (error) {
    // Проверяем, что ошибка уже была обработана
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    
    // Обрабатываем другие ошибки
    console.error('API request error:', error);
    throw {
      status: 500,
      message: 'Ошибка соединения с сервером',
    };
  }
}

// API клиент
export const api = {
  get: <T>(url: string, options: RequestOptions = {}): Promise<T> => 
    fetchWithAuth(url, 'GET', options),
  
  post: <T>(url: string, body: any, options: RequestOptions = {}): Promise<T> => 
    fetchWithAuth(url, 'POST', { ...options, body }),
  
  put: <T>(url: string, body: any, options: RequestOptions = {}): Promise<T> => 
    fetchWithAuth(url, 'PUT', { ...options, body }),
  
  patch: <T>(url: string, body: any, options: RequestOptions = {}): Promise<T> => 
    fetchWithAuth(url, 'PATCH', { ...options, body }),
  
  delete: <T>(url: string, options: RequestOptions = {}): Promise<T> => 
    fetchWithAuth(url, 'DELETE', options),
};
