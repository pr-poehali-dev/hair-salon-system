
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Pencil, Trash2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { StaffMember } from '@/data/services';
import { staffApi } from '@/services/admin-api';
import { useApiData } from '@/hooks/use-api-data';
import { useToast } from '@/hooks/use-toast';

interface StaffTabProps {
  onDeleteClick: (id: string | number, type: string, name: string) => void;
}

const StaffTab = ({ onDeleteClick }: StaffTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    data: staffMembers,
    loading,
    error,
    refresh,
    setParams
  } = useApiData<StaffMember>({
    fetchFn: staffApi.getAll,
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

  // Обработчик добавления сотрудника
  const handleAddStaff = () => {
    toast({
      title: "Функция в разработке",
      description: "Добавление сотрудников будет доступно в следующей версии",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Управление персоналом</CardTitle>
          <CardDescription>
            Здесь вы можете добавлять, редактировать и удалять информацию о мастерах
          </CardDescription>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddStaff}>
          <PlusCircle className="h-4 w-4" />
          <span>Добавить сотрудника</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Поиск сотрудников..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading && (
          <div className="py-10 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            <span className="ml-2 text-gray-500">Загрузка сотрудников...</span>
          </div>
        )}
        
        {error && (
          <div className="py-10 flex justify-center items-center text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</span>
          </div>
        )}
        
        {!loading && !error && staffMembers && staffMembers.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>Сотрудники не найдены</p>
            {searchTerm && (
              <p className="mt-2">Попробуйте изменить параметры поиска</p>
            )}
          </div>
        )}
        
        {!loading && !error && staffMembers && staffMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={staff.image} 
                    alt={staff.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">{staff.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{staff.position}</p>
                  <p className="text-sm flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{staff.workHours.start} - {staff.workHours.end}</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {staff.workDays.map((day, index) => {
                      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                      return (
                        <Badge key={index} variant="outline" className="text-xs">
                          {days[day]}
                        </Badge>
                      );
                    })}
                  </div>
                  <p className="text-sm mb-3">
                    Услуг: {staff.services.length}
                  </p>
                  <div className="flex justify-end mt-3 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Функция в разработке",
                          description: "Редактирование сотрудников будет доступно в следующей версии",
                        });
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Изменить
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteClick(staff.id, 'сотрудника', staff.name)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffTab;
