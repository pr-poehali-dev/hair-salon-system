
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Appointment, appointmentsApi, CreateAppointmentDto, UpdateAppointmentDto } from '@/services/appointments';
import { staffApi } from '@/services/admin-api';
import { servicesApi } from '@/services/admin-api';
import { useApiData } from '@/hooks/use-api-data';
import { Service } from '@/data/services';
import { StaffMember } from '@/data/services';
import { Loader2 } from 'lucide-react';

interface AppointmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave: () => void;
}

const AppointmentFormDialog = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onSave 
}: AppointmentFormDialogProps) => {
  // Получаем все услуги для выбора
  const { 
    data: services, 
    loading: servicesLoading 
  } = useApiData<Service>({
    fetchFn: servicesApi.getAll,
    initialParams: { perPage: 100 },
    immediate: true,
  });

  // Получаем всех сотрудников для выбора
  const {
    data: staff,
    loading: staffLoading
  } = useApiData<StaffMember>({
    fetchFn: staffApi.getAll,
    initialParams: { perPage: 100 },
    immediate: true,
  });

  // Состояние формы
  const [formData, setFormData] = useState<CreateAppointmentDto | UpdateAppointmentDto>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    staffId: '',
    date: '',
    time: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // При изменении записи или открытии диалога обновляем форму
  useEffect(() => {
    if (appointment) {
      setFormData({
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        clientEmail: appointment.clientEmail || '',
        serviceId: appointment.serviceId,
        staffId: appointment.staffId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        comments: appointment.comments || ''
      });
    } else {
      // Устанавливаем дату по умолчанию на сегодня
      const today = new Date().toISOString().split('T')[0];
      
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serviceId: '',
        staffId: '',
        date: today,
        time: '',
        comments: ''
      });
    }
  }, [appointment, isOpen]);

  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (appointment) {
        // Обновление существующей записи
        await appointmentsApi.update(appointment.id, formData);
      } else {
        // Создание новой записи
        await appointmentsApi.create(formData as CreateAppointmentDto);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить запись. Проверьте введенные данные.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Форматируем номер телефона
  const formatPhoneNumber = (value: string) => {
    // Убираем все не цифры
    const numbers = value.replace(/\D/g, '');
    
    // Форматируем номер как +7 (XXX) XXX-XX-XX
    if (numbers.length <= 1) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `+7 (${numbers.slice(1)}`;
    } else if (numbers.length <= 7) {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    } else if (numbers.length <= 9) {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    } else {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
    }
  };

  // Обработчик изменения номера телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      clientPhone: formatted
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {appointment ? 'Редактирование записи' : 'Создание новой записи'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о записи клиента.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="clientName">Имя клиента</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="clientPhone">Телефон</Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="clientEmail">Email (необязательно)</Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="serviceId">Услуга</Label>
              {servicesLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Загрузка услуг...</span>
                </div>
              ) : (
                <Select
                  name="serviceId"
                  value={formData.serviceId?.toString() || ''}
                  onValueChange={(value) => handleChange({ name: 'serviceId', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services && services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.title} - {service.price} ₽
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="staffId">Мастер</Label>
              {staffLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Загрузка мастеров...</span>
                </div>
              ) : (
                <Select
                  name="staffId"
                  value={formData.staffId?.toString() || ''}
                  onValueChange={(value) => handleChange({ name: 'staffId', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите мастера" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff && staff.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name} - {member.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="time">Время</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {appointment && (
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  name="status"
                  value={formData.status || 'pending'}
                  onValueChange={(value) => handleChange({ name: 'status', value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="confirmed">Подтверждена</SelectItem>
                    <SelectItem value="completed">Выполнена</SelectItem>
                    <SelectItem value="canceled">Отменена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="comments">Комментарии</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments || ''}
                onChange={handleChange}
                placeholder="Дополнительная информация..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
