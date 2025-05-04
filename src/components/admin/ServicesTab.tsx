
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Pencil, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Service } from '@/data/services';
import { servicesApi } from '@/services/admin-api';
import { useApiData } from '@/hooks/use-api-data';
import { useToast } from '@/hooks/use-toast';

interface ServicesTabProps {
  onDeleteClick: (id: string | number, type: string, name: string) => void;
}

const ServicesTab = ({ onDeleteClick }: ServicesTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    data: services,
    loading,
    error,
    refresh,
    setParams
  } = useApiData<Service>({
    fetchFn: servicesApi.getAll,
    initialParams: { perPage: 20 },
    immediate: true,
  });

  // Обработчик поиска с задержкой (debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setParams({ search: searchTerm, page: 1 });
      } else {
        setParams({ search: undefined, page: 1 });
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, setParams]);

  // Форматирование цены
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  // Форматирование длительности
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ч ${mins > 0 ? `${mins} мин` : ''}`;
    }
    return `${mins} мин`;
  };

  // Обработчик добавления услуги
  const handleAddService = () => {
    // Здесь будет открытие формы добавления, пока просто уведомление
    toast({
      title: "Функция в разработке",
      description: "Добавление услуг будет доступно в следующей версии",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Управление услугами</CardTitle>
          <CardDescription>
            Здесь вы можете добавлять, редактировать и удалять услуги салона
          </CardDescription>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddService}>
          <PlusCircle className="h-4 w-4" />
          <span>Добавить услугу</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Поиск услуг..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading && (
          <div className="py-10 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            <span className="ml-2 text-gray-500">Загрузка услуг...</span>
          </div>
        )}
        
        {error && (
          <div className="py-10 flex justify-center items-center text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</span>
          </div>
        )}
        
        {!loading && !error && services && services.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>Услуги не найдены</p>
            {searchTerm && (
              <p className="mt-2">Попробуйте изменить параметры поиска</p>
            )}
          </div>
        )}
        
        {!loading && !error && services && services.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Длительность</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <span>{service.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>{formatDuration(service.duration)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => {
                            toast({
                              title: "Функция в разработке",
                              description: "Редактирование услуг будет доступно в следующей версии",
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => onDeleteClick(service.id, 'услугу', service.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesTab;
