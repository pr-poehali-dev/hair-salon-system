
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { toast } from '@/components/ui/use-toast';

export const useAdminGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast({
        variant: 'destructive',
        title: 'Доступ запрещен',
        description: 'У вас нет прав для доступа к этой странице',
      });
      navigate('/');
    }
  }, [user, loading, navigate]);

  return {
    isAdmin: !loading && user?.role === 'admin',
    user,
    loading
  };
};
