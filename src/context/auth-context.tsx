
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Тип для пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

// Интерфейс контекста авторизации
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Создание контекста
const AuthContext = createContext<AuthContextType | null>(null);

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

// Моковые данные для имитации работы с сервером
const mockUsers = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@glamurshik.ru',
    password: 'admin123',
    phone: '+7 (999) 123-45-67',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Тестовый пользователь',
    email: 'user@example.com',
    password: 'password123',
    phone: '+7 (999) 987-65-43',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    role: 'user' as const,
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

// Провайдер аутентификации
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Проверяем, есть ли сохраненный пользователь при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Имитация задержки запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Неверный email или пароль');
      }
      
      // Сохраняем данные пользователя без пароля
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: 'Успешный вход',
        description: `Добро пожаловать, ${userWithoutPassword.name}!`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Ошибка при входе',
          description: error.message,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Функция регистрации
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Имитация задержки запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверяем, существует ли пользователь с таким email
      if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      // В реальном приложении здесь был бы запрос к API для создания пользователя
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role: 'user',
      };
      
      // Сохраняем пользователя
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: 'Регистрация успешна',
        description: 'Вы успешно зарегистрированы в системе',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Ошибка при регистрации',
          description: error.message,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
    });
  };

  // Функция обновления профиля
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      // Имитация задержки запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }
      
      // Обновляем данные пользователя
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: 'Профиль обновлен',
        description: 'Данные профиля успешно обновлены',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Ошибка при обновлении профиля',
          description: error.message,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Значение контекста
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
