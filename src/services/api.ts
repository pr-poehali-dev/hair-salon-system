
/**
 * Базовый API-клиент для работы с бэкендом
 */

// Базовый URL API (в реальном приложении настраивается через .env)
const API_BASE_URL = 'https://api.salon-beauty.example/api';

// Типы для запросов
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Выполняет запрос к API и обрабатывает ответ
 */
const fetchApi = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  // Формируем URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Настраиваем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Добавляем токен авторизации, если он есть
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Выполняем запрос
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    
    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка запроса: ${response.status}`);
    }
    
    // Возвращаем данные
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Экспортируем методы для работы с API
export const api = {
  // GET запрос
  get: <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  // POST запрос
  post: <T>(endpoint: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body: data }),
  
  // PUT запрос
  put: <T>(endpoint: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body: data }),
  
  // DELETE запрос
  delete: <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
