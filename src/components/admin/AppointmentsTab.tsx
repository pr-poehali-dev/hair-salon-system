
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
import { 
  Search, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  CalendarDays, 
  User, 
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Appointment, appointmentsApi } from '@/services/appointments';
import { useApiData } from '@/hooks/use-api-data';
import { useToast } from '@/hooks/use-toast';
import AppointmentFormDialog from './AppointmentFormDialog';

interface AppointmentsTabProps {
  onDeleteClick: (id: string | number, type: string, name: string) => void;
}

const AppointmentsTab = ({ onDeleteClick }: AppointmentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();
  
  const {
    data: appointments,
    loading,
    error,
    refresh,
    setParams
  } = useApiData<Appointment>({
    fetchFn: appointmentsApi.getAll,
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

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Получаем статус записи
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Ожидает</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Подтверждена</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Выполнена</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Отменена</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  // Обработчик добавления записи
  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  // Обработчик редактирования записи
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  // Обработчик подтверждения записи
  const handleConfirmAppointment = async (id: string | number) => {
    try {
      await appointmentsApi.confirm(id);
      refresh();
      toast({
        title: "Запись подтверждена",
        description: "Статус записи успешно изменен на 'Подтверждена'",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось подтвердить запись",
        variant: "destructive"
      });
    }
  };

  // Обработчик отмены записи
  const handleCancelAppointment = async (id: string | number) => {
    try {
      await appointmentsApi.cancel(id);
      refresh();
      toast({
        title: "Запись отменена",
        description: "Статус записи успешно изменен на 'Отменена'",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отменить запись",
        variant: "destructive"
      });
    }
  };

  // Обработчик сохранения формы
  const handleFormSave = async () => {
    setIsFormOpen(false);
    refresh();
    toast({
      title: editingAppointment ? "Запись обновлена" : "Запись создана",
      description: "Данные были успешно сохранены"
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Управление записями клиентов</CardTitle>
            <CardDescription>
              Здесь вы можете просматривать, добавлять и редактировать записи клиентов
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2" onClick={handleAddAppointment}>
            <PlusCircle className="h-4 w-4" />
            <span>Добавить запись</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск по имени клиента или номеру телефона..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading && (
            <div className="py-10 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
              <span className="ml-2 text-gray-500">Загрузка записей...</span>
            </div>
          )}
          
          {error && (
            <div className="py-10 flex justify-center items-center text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</span>
            </div>
          )}
          
          {!loading && !error && (!appointments || appointments.length === 0) && (
            <div className="py-10 text-center text-gray-500">
              <p>Записи не найдены</p>
              {searchTerm && (
                <p className="mt-2">Попробуйте изменить параметры поиска</p>
              )}
            </div>
          )}
          
          {!loading && !error && appointments && appointments.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Услуга</TableHead>
                    <TableHead>Дата и время</TableHead>
                    <TableHead>Мастер</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{appointment.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{appointment.clientPhone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{appointment.serviceName}</span>
                          <span className="text-sm text-muted-foreground">{appointment.price} ₽</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{appointment.time} ({appointment.duration} мин)</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.staffName}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {appointment.status === 'pending' && (
                            <>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-green-600 h-8 w-8"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                                title="Подтвердить"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-red-600 h-8 w-8"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                title="Отменить"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditAppointment(appointment)}
                            title="Редактировать"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive h-8 w-8"
                            onClick={() => onDeleteClick(appointment.id, 'запись', `${appointment.clientName} (${formatDate(appointment.date)})`)}
                            title="Удалить"
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

      <AppointmentFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        appointment={editingAppointment}
        onSave={handleFormSave}
      />
    </>
  );
};

export default AppointmentsTab;
