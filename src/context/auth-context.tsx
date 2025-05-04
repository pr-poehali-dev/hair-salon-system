
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginCredentials, AuthResponse } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Проверяем, авторизован ли пользователь
        const isAuth = authService.isAuthenticated();
        
        if (isAuth) {
          // Получаем данные пользователя
          const userData = authService.getUser();
          
          if (userData) {
            setUser(userData);
          } else {
            // Если данные пользователя отсутствуют, выходим из системы
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: 'Ошибка авторизации',
          description: 'Не удалось загрузить данные пользователя',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Настраиваем интервал для проверки токена
    const tokenCheckInterval = setInterval(async () => {
      if (authService.isAuthenticated()) {
        // Если токен почти истек, обновляем его
        const tokenExpiry = parseInt(localStorage.getItem('token_expiry') || '0', 10);
        const fiveMinutesBeforeExpiry = tokenExpiry - 5 * 60 * 1000; // 5 минут до истечения
        
        if (Date.now() > fiveMinutesBeforeExpiry) {
          try {
            await authService.refreshToken();
          } catch (error) {
            console.error('Token refresh error:', error);
          }
        }
      }
    }, 60000); // Проверяем каждую минуту
    
    return () => clearInterval(tokenCheckInterval);
  }, [toast]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response: AuthResponse = await authService.login(credentials);
      setUser(response.user);
      
      toast({
        title: 'Успешный вход',
        description: `Добро пожаловать, ${response.user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Ошибка входа',
        description: 'Неверный email или пароль',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    
    toast({
      title: 'Выход из системы',
      description: 'Вы успешно вышли из системы',
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
