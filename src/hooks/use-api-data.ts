
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
  refresh: () => Promise<void>;
  setParams: (newParams: Partial<FilterParams>) => void;
  params: FilterParams;
}

/**
 * Хук для работы с API данными
 */
export function useApiData<T>({
  fetchFn,
  initialParams = {},
  immediate = false,
}: UseApiDataProps<T>): UseApiDataResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParamsState] = useState<FilterParams>(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchFn(params);
      
      // Проверяем структуру ответа
      if (response.data) {
        // Если данные в формате пагинации
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          // Если это единичный объект, помещаем его в массив
          setData([response.data]);
        }
      } else {
        // Если структура ответа иная
        setData(Array.isArray(response) ? response : [response]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('API Data Error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, params]);
  
  // Обновление параметров запроса
  const setParams = useCallback((newParams: Partial<FilterParams>) => {
    setParamsState(prev => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  // Если immediate=true, выполняем запрос при монтировании компонента
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  // Выполняем запрос при изменении параметров
  useEffect(() => {
    if (immediate && Object.keys(params).length > 0) {
      fetchData();
    }
  }, [params, fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    setParams,
    params,
  };
}
