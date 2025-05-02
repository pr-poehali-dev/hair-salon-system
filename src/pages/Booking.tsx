
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, parse, isWithinInterval, set } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  services, 
  staffMembers, 
  getServiceById, 
  getStaffForService, 
  formatDuration, 
  formatPrice,
  Service,
  Staff,
} from "@/data/services";
import { toast } from "@/components/ui/use-toast";

// Схема валидации формы
const bookingSchema = z.object({
  serviceId: z.string({
    required_error: "Выберите услугу",
  }),
  staffId: z.string({
    required_error: "Выберите специалиста",
  }),
  date: z.date({
    required_error: "Выберите дату",
  }),
  time: z.string({
    required_error: "Выберите время",
  }),
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(5, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email"),
  comments: z.string().optional(),
  paymentMethod: z.enum(["online", "cash"], {
    required_error: "Выберите способ оплаты",
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// Шаги бронирования
enum BookingStep {
  Service = 0,
  StaffAndDate = 1,
  ContactInfo = 2,
  Summary = 3,
  Confirmation = 4,
}

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.Service);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      staffId: "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      comments: "",
      paymentMethod: "online",
    },
  });

  // Предварительно выбранная услуга из URL параметра
  useEffect(() => {
    const serviceId = searchParams.get("service");
    if (serviceId) {
      const service = getServiceById(serviceId);
      if (service) {
        form.setValue("serviceId", serviceId);
        setSelectedService(service);
        setCurrentStep(BookingStep.StaffAndDate);
      }
    }
  }, [searchParams, form]);

  // Следующий шаг
  const nextStep = () => {
    setCurrentStep((prev) => (prev < BookingStep.Confirmation ? prev + 1 : prev));
  };

  // Предыдущий шаг
  const prevStep = () => {
    setCurrentStep((prev) => (prev > BookingStep.Service ? prev - 1 : prev));
  };

  // Обработчик изменения услуги
  const handleServiceChange = (serviceId: string) => {
    const service = getServiceById(serviceId);
    setSelectedService(service || null);
    form.setValue("staffId", ""); // Сбрасываем выбранного мастера
    setSelectedStaff(null);
  };

  // Обработчик изменения мастера
  const handleStaffChange = (staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    setSelectedStaff(staff || null);
    
    // Если выбрана дата, генерируем доступные слоты для этого мастера
    const selectedDate = form.getValues("date");
    if (selectedDate && staff) {
      generateTimeSlots(selectedDate, staff);
    }
  };

  // Обработчик изменения даты
  const handleDateChange = (date: Date) => {
    form.setValue("date", date);
    form.setValue("time", ""); // Сбрасываем выбранное время
    
    // Если выбран мастер, генерируем доступные слоты
    const staffId = form.getValues("staffId");
    if (staffId) {
      const staff = staffMembers.find((s) => s.id === staffId);
      if (staff) {
        generateTimeSlots(date, staff);
      }
    }
  };

  // Генерация доступных временных слотов
  const generateTimeSlots = (date: Date, staff: Staff) => {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, и т.д.
    
    // Проверяем, работает ли мастер в этот день
    if (!staff.workDays.includes(dayOfWeek)) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Парсинг рабочих часов
    const startTime = parse(staff.workHours.start, "HH:mm", new Date());
    const endTime = parse(staff.workHours.end, "HH:mm", new Date());
    
    // Продолжительность выбранной услуги
    const serviceDuration = selectedService?.duration || 60; // в минутах
    
    // Генерация слотов с интервалом 30 минут
    const slots: string[] = [];
    let currentTime = startTime;
    
    while (
      isWithinInterval(
        set(currentTime, { 
          hours: currentTime.getHours(), 
          minutes: currentTime.getMinutes() + serviceDuration 
        }),
        { start: startTime, end: endTime }
      )
    ) {
      slots.push(format(currentTime, "HH:mm"));
      currentTime = set(currentTime, { minutes: currentTime.getMinutes() + 30 });
    }
    
    // В реальном приложении здесь бы учитывались уже занятые слоты
    setAvailableTimeSlots(slots);
  };

  // Отправка формы
  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Имитация отправки данных на сервер
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Переход к подтверждению
      nextStep();
      
      toast({
        title: "Запись успешно создана!",
        description: "Мы отправили подтверждение на ваш email",
        duration: 5000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка при создании записи",
        description: "Пожалуйста, попробуйте еще раз",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Рендер формы в зависимости от текущего шага
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.Service:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-playfair mb-4">Выберите услугу</h2>
            
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id}>
                        <FormControl>
                          <div
                            className={`cursor-pointer border rounded-lg p-4 transition-all ${
                              field.value === service.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              field.onChange(service.id);
                              handleServiceChange(service.id);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={service.image}
                                  alt={service.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg mb-1">{service.title}</h3>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{formatDuration(service.duration)}</span>
                                  </div>
                                  <span className="font-semibold text-primary">{formatPrice(service.price)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => navigate("/services")}>
                Назад к услугам
              </Button>
              <Button
                onClick={nextStep}
                disabled={!form.getValues("serviceId")}
              >
                Далее
              </Button>
            </div>
          </div>
        );
        
      case BookingStep.StaffAndDate:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-playfair mb-4">Выберите мастера и дату</h2>
            
            {selectedService && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-2">Выбранная услуга</h3>
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={selectedService.image}
                      alt={selectedService.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedService.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDuration(selectedService.duration)}</span>
                      </div>
                      <span className="font-semibold text-primary">{formatPrice(selectedService.price)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(BookingStep.Service)}
                  className="mt-2"
                >
                  Изменить услугу
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Выберите мастера</FormLabel>
                    <div className="grid grid-cols-1 gap-3">
                      {getStaffForService(form.getValues("serviceId")).map((staff) => (
                        <FormControl key={staff.id}>
                          <div
                            className={`cursor-pointer border rounded-lg p-3 transition-all ${
                              field.value === staff.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              field.onChange(staff.id);
                              handleStaffChange(staff.id);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                  src={staff.image}
                                  alt={staff.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{staff.name}</h4>
                                <p className="text-sm text-gray-600">{staff.position}</p>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Выберите дату</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: ru })
                              ) : (
                                <span>Выберите дату</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                handleDateChange(date);
                              }
                            }}
                            disabled={(date) => {
                              // Запрещаем выбор прошедших дат
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // Запрещаем выбор дат более чем через 2 недели
                              const twoWeeksFromNow = addDays(today, 14);
                              
                              // Если выбран мастер, проверяем его рабочие дни
                              const staffId = form.getValues("staffId");
                              if (staffId) {
                                const staff = staffMembers.find((s) => s.id === staffId);
                                if (staff) {
                                  // Проверяем, работает ли мастер в этот день недели
                                  const dayOfWeek = date.getDay();
                                  if (!staff.workDays.includes(dayOfWeek)) {
                                    return true; // Мастер не работает в этот день
                                  }
                                }
                              }
                              
                              return date < today || date > twoWeeksFromNow;
                            }}
                            locale={ru}
                            fromDate={new Date()}
                            toDate={addDays(new Date(), 14)}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите время</FormLabel>
                      <Select
                        disabled={!form.getValues("date") || !form.getValues("staffId")}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите время" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-2 px-2 text-sm text-gray-500">
                              {form.getValues("date") && form.getValues("staffId")
                                ? "Нет доступных слотов на выбранную дату"
                                : "Сначала выберите мастера и дату"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button
                onClick={nextStep}
                disabled={!form.getValues("staffId") || !form.getValues("date") || !form.getValues("time")}
              >
                Далее
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case BookingStep.ContactInfo:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-playfair mb-4">Контактная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Ваше имя" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="+7 (999) 123-45-67" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="your@email.com" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Комментарий (необязательно)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Textarea 
                            placeholder="Дополнительная информация" 
                            className="pl-9 min-h-[100px]" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Способ оплаты</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="online" />
                            <label
                              htmlFor="online"
                              className="flex items-center cursor-pointer"
                            >
                              <CreditCard className="h-4 w-4 mr-2 text-primary" />
                              <span>Онлайн оплата (скидка 5%)</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <label
                              htmlFor="cash"
                              className="flex items-center cursor-pointer"
                            >
                              <Scissors className="h-4 w-4 mr-2 text-primary" />
                              <span>Оплата в салоне</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedService && selectedStaff && form.getValues("date") && form.getValues("time") && (
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <h3 className="font-medium text-lg mb-4">Детали записи</h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Услуга:</span>
                          <span className="font-medium">{selectedService.title}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Мастер:</span>
                          <span className="font-medium">{selectedStaff.name}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Дата:</span>
                          <span className="font-medium">
                            {format(form.getValues("date"), "PPP", { locale: ru })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Время:</span>
                          <span className="font-medium">{form.getValues("time")}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Продолжительность:</span>
                          <span className="font-medium">{formatDuration(selectedService.duration)}</span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex justify-between items-center font-medium text-base">
                          <span>Итого:</span>
                          <span className="text-primary">
                            {form.getValues("paymentMethod") === "online"
                              ? formatPrice(Math.round(selectedService.price * 0.95))
                              : formatPrice(selectedService.price)}
                          </span>
                        </div>
                        
                        {form.getValues("paymentMethod") === "online" && (
                          <div className="text-green-600 text-xs text-right">
                            Включена скидка 5% за онлайн оплату
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button
                onClick={nextStep}
                disabled={
                  !form.getValues("name") ||
                  !form.getValues("phone") ||
                  !form.getValues("email")
                }
              >
                Перейти к подтверждению
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case BookingStep.Summary:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-playfair mb-4">Подтверждение записи</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">Детали услуги</h3>
                  
                  <div className="space-y-4">
                    {selectedService && (
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={selectedService.image}
                            alt={selectedService.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{selectedService.title}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDuration(selectedService.duration)}</span>
                          </div>
                          <span className="font-semibold text-primary block mt-1">
                            {form.getValues("paymentMethod") === "online"
                              ? formatPrice(Math.round(selectedService.price * 0.95))
                              : formatPrice(selectedService.price)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Дата:</span>
                        <span className="font-medium">
                          {format(form.getValues("date"), "PPP", { locale: ru })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Время:</span>
                        <span className="font-medium">{form.getValues("time")}</span>
                      </div>
                      
                      {selectedStaff && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Мастер:</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{selectedStaff.name}</span>
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={selectedStaff.image}
                                alt={selectedStaff.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Способ оплаты:</span>
                        <span className="font-medium">
                          {form.getValues("paymentMethod") === "online"
                            ? "Онлайн оплата (скидка 5%)"
                            : "Оплата в салоне"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Ваши данные</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Имя:</span>
                      <span className="font-medium">{form.getValues("name")}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Телефон:</span>
                      <span className="font-medium">{form.getValues("phone")}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{form.getValues("email")}</span>
                    </div>
                    
                    {form.getValues("comments") && (
                      <div className="mt-4">
                        <span className="text-gray-600 block mb-1">Комментарий:</span>
                        <div className="bg-white p-2 rounded border text-sm">
                          {form.getValues("comments")}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm">
                    <p className="text-blue-700">
                      После подтверждения записи вы получите письмо с деталями на указанный email.
                      За 24 часа до визита мы отправим вам SMS-напоминание.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">Итоговая стоимость:</span>
                    <div className="text-xl font-bold text-primary">
                      {selectedService && (
                        form.getValues("paymentMethod") === "online"
                          ? formatPrice(Math.round(selectedService.price * 0.95))
                          : formatPrice(selectedService.price)
                      )}
                    </div>
                    {form.getValues("paymentMethod") === "online" && (
                      <div className="text-green-600 text-xs">
                        Включена скидка 5% за онлайн оплату
                      </div>
                    )}
                  </div>
                  
                  <div className="space-x-4">
                    <Button variant="outline" onClick={prevStep}>
                      Изменить данные
                    </Button>
                    <Button 
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Обработка...
                        </>
                      ) : (
                        "Подтвердить запись"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case BookingStep.Confirmation:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600 h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-bold font-playfair mb-2">Запись успешно создана!</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Детали вашей записи отправлены на почту {form.getValues("email")}.
              За день до визита мы отправим SMS-напоминание.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8">
              <div className="text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Услуга:</span>
                  <span className="font-medium">{selectedService?.title}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Дата и время:</span>
                  <span className="font-medium">
                    {format(form.getValues("date"), "PPP", { locale: ru })}, {form.getValues("time")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Мастер:</span>
                  <span className="font-medium">{selectedStaff?.name}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center font-medium">
                  <span>Стоимость:</span>
                  <span className="text-primary">
                    {selectedService && (
                      form.getValues("paymentMethod") === "online"
                        ? formatPrice(Math.round(selectedService.price * 0.95))
                        : formatPrice(selectedService.price)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Номер записи:</span>
                  <span className="font-medium">BK-{Math.floor(Math.random() * 10000)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/profile?tab=appointments")}>
                Перейти к моим записям
              </Button>
              <Button onClick={() => navigate("/")}>
                Вернуться на главную
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="py-12 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-playfair mb-2 text-center">
          Онлайн-запись
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Выберите услугу, удобное время и мастера для записи в наш салон красоты
        </p>
        
        {/* Индикатор прогресса */}
        {currentStep < BookingStep.Confirmation && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="flex justify-between">
              <div className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= BookingStep.Service
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Услуга</span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= BookingStep.StaffAndDate
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Мастер и дата</span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= BookingStep.ContactInfo
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Контакты</span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= BookingStep.Summary
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  4
                </div>
                <span className="text-sm font-medium">Подтверждение</span>
              </div>
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (BookingStep.Summary)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Основное содержимое */}
        <div className="max-w-5xl mx-auto">
          <Form {...form}>
            <form>{renderStepContent()}</form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
