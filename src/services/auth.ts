
import { api } from './api';

// Типы для аутентификации
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Ключи для хранения токенов в localStorage
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USER_KEY = 'user_data';

// Сервис для работы с аутентификацией
export const authService = {
  // Вход в систему
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Сохраняем токены и данные пользователя
    if (response && response.tokens) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      
      // Вычисляем время истечения токена
      const expiryTime = Date.now() + response.tokens.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      // Сохраняем данные пользователя
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    
    return response;
  },
  
  // Выход из системы
  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Можно добавить запрос к API для инвалидации токена на сервере
    // api.post('/auth/logout', {}).catch(() => {});
  },
  
  // Обновление токена
  refreshToken: async (): Promise<AuthTokens | null> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
      
      if (response && response.tokens) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.tokens.accessToken);
        
        // Обновляем время истечения токена
        const expiryTime = Date.now() + response.tokens.expiresIn * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        
        return response.tokens;
      }
      
      return null;
    } catch (error) {
      // Если не удалось обновить токен, выходим из системы
      authService.logout();
      return null;
    }
  },
  
  // Проверка авторизации
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryTimeStr) {
      return false;
    }
    
    // Проверяем, не истек ли токен
    const expiryTime = parseInt(expiryTimeStr, 10);
    const isTokenExpired = Date.now() > expiryTime;
    
    return !isTokenExpired;
  },
  
  // Получение токена
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  // Получение данных пользователя
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  },
  
  // Проверка роли пользователя
  hasRole: (role: string): boolean => {
    const user = authService.getUser();
    return user ? user.role === role : false;
  },
};
