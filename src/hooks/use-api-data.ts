
import { useState, useEffect, useCallback } from 'react';
import { FilterParams } from '@/services/admin-api';

interface UseApiDataProps<T> {
  fetchFn: (params?: FilterParams) => Promise<any>;
  initialParams?: FilterParams;
  immediate?: boolean;
}

interface UseApiDataResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  fetchData: (params?: FilterParams) => Promise<void>;
  setParams: (params: FilterParams) => void;
  refresh: () => Promise<void>;
}

/**
 * Хук для загрузки данных с API с поддержкой фильтрации и пагинации
 */
export function useApiData<T>({
  fetchFn,
  initialParams = { page: 1, perPage: 10 },
  immediate = true
}: UseApiDataProps<T>): UseApiDataResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<FilterParams>(initialParams);
  
  // Метаданные пагинации
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Функция загрузки данных
  const fetchData = useCallback(async (overrideParams?: FilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedParams = { ...params, ...overrideParams };
      const response = await fetchFn(mergedParams);
      
      if (response.data) {
        setData(response.data);
        
        // Обновляем метаданные пагинации, если они есть
        if ('total' in response) {
          setTotalItems(response.total);
          setCurrentPage(response.page || 1);
          setTotalPages(response.totalPages || 1);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Произошла ошибка при загрузке данных'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, params]);

  // Обновление параметров и повторная загрузка
  const updateParams = useCallback((newParams: FilterParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Автоматическая загрузка при монтировании или изменении параметров
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [params, immediate, fetchData]);

  // Функция для принудительного обновления данных
  const refresh = useCallback(() => fetchData(), [fetchData]);

  return {
    data,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    fetchData,
    setParams: updateParams,
    refresh
  };
}
