
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/ui/use-toast';

interface UseAuthRedirectOptions {
  redirectTo: string;
  message?: string;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

/**
 * Хук для перенаправления в зависимости от статуса авторизации
 * @param options Настройки перенаправления
 */
export const useAuthRedirect = ({
  redirectTo,
  message,
  requireAuth = false,
  requireAdmin = false,
}: UseAuthRedirectOptions) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Если требуется авторизация, но пользователь не авторизован
    if (requireAuth && !user) {
      if (message) {
        toast({
          variant: 'destructive',
          title: 'Требуется авторизация',
          description: message || 'Для доступа к этой странице необходимо войти в систему',
        });
      }
      navigate(redirectTo);
      return;
    }

    // Если требуются права администратора, но пользователь не админ
    if (requireAdmin && (!user || user.role !== 'admin')) {
      if (message) {
        toast({
          variant: 'destructive',
          title: 'Доступ запрещен',
          description: message || 'У вас недостаточно прав для доступа к этой странице',
        });
      }
      navigate(redirectTo);
      return;
    }

    // Если пользователь уже авторизован, но пытается зайти на страницу логина/регистрации
    if (!requireAuth && !requireAdmin && user) {
      if (message) {
        toast({
          title: 'Вы уже авторизованы',
          description: message || 'Вы уже вошли в систему',
        });
      }
      navigate(redirectTo);
      return;
    }
  }, [user, loading, navigate, redirectTo, message, requireAuth, requireAdmin]);
};
