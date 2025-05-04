
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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Appointment, appointmentsApi, CreateAppointmentDto, UpdateAppointmentDto } from '@/services/appointments';
import { staffApi } from '@/services/admin-api';
import { servicesApi } from '@/services/admin-api';
import { useApiData } from '@/hooks/use-api-data';
import { Service } from '@/data/services';
import { StaffMember } from '@/data/services';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Схема валидации для формы
const appointmentFormSchema = z.object({
  clientName: z.string().min(2, {
    message: "Имя клиента должно быть не менее 2 символов"
  }),
  clientPhone: z.string().min(6, {
    message: "Введите корректный номер телефона"
  }),
  clientEmail: z.string().email({
    message: "Введите корректный email"
  }).optional().or(z.literal("")),
  serviceId: z.string().min(1, {
    message: "Выберите услугу"
  }),
  staffId: z.string().min(1, {
    message: "Выберите мастера"
  }),
  date: z.string().min(1, {
    message: "Выберите дату"
  }),
  time: z.string().min(1, {
    message: "Выберите время"
  }),
  status: z.enum(["pending", "confirmed", "completed", "canceled"]).optional(),
  comments: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

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
    loading: servicesLoading,
    error: servicesError
  } = useApiData<Service>({
    fetchFn: servicesApi.getAll,
    initialParams: { perPage: 100 },
    immediate: true,
  });

  // Получаем всех сотрудников для выбора
  const {
    data: staff,
    loading: staffLoading,
    error: staffError
  } = useApiData<StaffMember>({
    fetchFn: staffApi.getAll,
    initialParams: { perPage: 100 },
    immediate: true,
  });

  // Состояние для выбранной услуги (для получения длительности и цены)
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Настройка формы с React Hook Form и Zod валидацией
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      staffId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      comments: ''
    }
  });

  // При изменении записи или открытии диалога обновляем форму
  useEffect(() => {
    if (appointment) {
      form.reset({
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        clientEmail: appointment.clientEmail || '',
        serviceId: appointment.serviceId.toString(),
        staffId: appointment.staffId.toString(),
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        comments: appointment.comments || ''
      });

      // Находим выбранную услугу
      if (services) {
        const service = services.find(s => s.id.toString() === appointment.serviceId.toString());
        if (service) {
          setSelectedService(service);
        }
      }
    } else {
      // Сбрасываем форму
      const today = new Date().toISOString().split('T')[0];
      
      form.reset({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        serviceId: '',
        staffId: '',
        date: today,
        time: '',
        comments: ''
      });
      
      setSelectedService(null);
    }
  }, [appointment, isOpen, form, services]);

  // Обработчик изменения выбранной услуги
  const handleServiceChange = (serviceId: string) => {
    if (services) {
      const service = services.find(s => s.id.toString() === serviceId);
      if (service) {
        setSelectedService(service);
      }
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
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    form.setValue('clientPhone', formatted);
  };

  // Обработчик отправки формы
  const onSubmit = async (values: AppointmentFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (appointment) {
        // Обновление существующей записи
        await appointmentsApi.update(appointment.id, values as UpdateAppointmentDto);
      } else {
        // Создание новой записи
        await appointmentsApi.create(values as CreateAppointmentDto);
      }
      
      onSave();
      form.reset();
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

  // Если есть ошибки загрузки данных
  const hasLoadingErrors = servicesError || staffError;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        {hasLoadingErrors ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Ошибка загрузки данных</h3>
            <p className="text-center text-muted-foreground mb-4">
              Не удалось загрузить необходимые данные для формы. Пожалуйста, попробуйте позже.
            </p>
            <Button onClick={onClose}>Закрыть</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {appointment ? 'Редактирование записи' : 'Создание новой записи'}
                </DialogTitle>
                <DialogDescription>
                  Заполните информацию о записи клиента.
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя клиента</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => handlePhoneChange(e.target.value)}
                              placeholder="+7 (___) ___-__-__"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (необязательно)</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Услуга</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleServiceChange(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите услугу" />
                            </SelectTrigger>
                            <SelectContent>
                              {servicesLoading ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Загрузка...
                                </div>
                              ) : (
                                services && services.map((service) => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.title} - {service.price} ₽
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedService && (
                    <div className="bg-muted/40 p-3 rounded-md text-sm">
                      <div className="flex justify-between">
                        <span>Длительность:</span>
                        <span className="font-medium">{selectedService.duration} мин</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Стоимость:</span>
                        <span className="font-medium">{selectedService.price} ₽</span>
                      </div>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="staffId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Мастер</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите мастера" />
                            </SelectTrigger>
                            <SelectContent>
                              {staffLoading ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Загрузка...
                                </div>
                              ) : (
                                staff && staff.map((member) => (
                                  <SelectItem key={member.id} value={member.id.toString()}>
                                    {member.name} - {member.position}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Дата</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Время</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {appointment && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Статус</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || 'pending'}
                              onValueChange={(value: "pending" | "confirmed" | "completed" | "canceled") => field.onChange(value)}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Комментарии</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Дополнительная информация..."
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              
              <DialogFooter className="mt-6">
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
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFormDialog;
