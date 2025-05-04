
import { useState, useEffect, useMemo } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
  XCircle,
  Filter,
  MoreVertical,
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFrame, setTimeFrame] = useState<string>('upcoming');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const {
    data: appointments,
    loading,
    error,
    refresh,
    setParams,
    params
  } = useApiData<Appointment>({
    fetchFn: appointmentsApi.getAll,
    initialParams: { perPage: 10, page: 1 },
    immediate: true,
  });

  // Задаем начальную дату для фильтра "Сегодня"
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }, []);

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

  // Обработчик изменения фильтра статуса
  useEffect(() => {
    let statusParam = undefined;
    if (statusFilter !== 'all') {
      statusParam = statusFilter;
    }
    setParams({ status: statusParam, page: 1 });
  }, [statusFilter, setParams]);

  // Обработчик изменения временного фильтра
  useEffect(() => {
    let dateParams = {};
    
    switch (timeFrame) {
      case 'today':
        dateParams = { date: today };
        break;
      case 'past':
        dateParams = { endDate: today };
        break;
      case 'upcoming':
        dateParams = { startDate: today };
        break;
      // 'all' - никаких дополнительных параметров
    }
    
    setParams({ ...dateParams, page: 1 });
  }, [timeFrame, today, setParams]);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setParams({ ...params, page });
  };

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

  // Обработчик завершения записи
  const handleCompleteAppointment = async (id: string | number) => {
    try {
      await appointmentsApi.changeStatus(id, 'completed');
      refresh();
      toast({
        title: "Запись завершена",
        description: "Статус записи успешно изменен на 'Выполнена'",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось завершить запись",
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
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени клиента или номеру телефона..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="w-full sm:w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">Ожидают</SelectItem>
                    <SelectItem value="confirmed">Подтвержденные</SelectItem>
                    <SelectItem value="completed">Выполненные</SelectItem>
                    <SelectItem value="canceled">Отмененные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-[180px]">
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все записи</SelectItem>
                    <SelectItem value="today">Сегодня</SelectItem>
                    <SelectItem value="upcoming">Предстоящие</SelectItem>
                    <SelectItem value="past">Прошедшие</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  setStatusFilter('all');
                  setTimeFrame('upcoming');
                  setSearchTerm('');
                }}
                title="Сбросить все фильтры"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
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
            <div className="py-10 text-center text-muted-foreground border rounded-md border-dashed">
              <p className="mb-2">Записи не найдены</p>
              {searchTerm && <p>Попробуйте изменить параметры поиска</p>}
              {!searchTerm && <Button onClick={handleAddAppointment} variant="outline" className="mt-4">Создать запись</Button>}
            </div>
          )}
          
          {!loading && !error && appointments && appointments.length > 0 && (
            <>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Действия</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              
                              {appointment.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Подтвердить
                                </DropdownMenuItem>
                              )}
                              
                              {appointment.status === 'confirmed' && (
                                <DropdownMenuItem onClick={() => handleCompleteAppointment(appointment.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Завершить
                                </DropdownMenuItem>
                              )}
                              
                              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Отменить
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => onDeleteClick(appointment.id, 'запись', `${appointment.clientName} (${formatDate(appointment.date)})`)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {/* Генерация пагинации */}
                  {Array.from({ length: 3 }).map((_, i) => {
                    const pageNum = currentPage - 1 + i;
                    if (pageNum > 0 && pageNum <= (appointments?.length || 10)) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage >= (appointments?.length || 10) ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
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
