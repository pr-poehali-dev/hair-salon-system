
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  UserCircle, 
  Clock, 
  Package, 
  Heart,
  Settings,
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Схема валидации формы профиля
const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  // Проверка авторизации
  useAuthRedirect({
    redirectTo: '/login',
    message: 'Для доступа к профилю необходимо авторизоваться',
    requireAuth: true,
  });

  const { user, updateProfile, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Настройка формы с react-hook-form и zod
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
    } catch (error) {
      // Ошибки обрабатываются внутри updateProfile
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем инициалы для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return null; // Редирект выполнится через useAuthRedirect
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold font-playfair mb-8">Личный кабинет</h1>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Записи</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Заказы</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Избранное</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Вкладка профиля */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Информация о пользователе</CardTitle>
                    <CardDescription>
                      Управляйте своей персональной информацией
                    </CardDescription>
                  </div>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="Иван Иванов" className="pl-9" {...field} />
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
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL аватара</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/avatar.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Сохранение...
                          </>
                        ) : (
                          'Сохранить изменения'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Завершение сеанса</CardTitle>
                <CardDescription>
                  Выход из учетной записи на этом устройстве
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Выйти из аккаунта</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка записей */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Мои записи</CardTitle>
                <CardDescription>
                  Управляйте своими записями на услуги
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">У вас еще нет записей</h3>
                  <p className="text-gray-600 mb-4">
                    Запишитесь на услугу, чтобы она отобразилась здесь
                  </p>
                  <Button>Записаться на услугу</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка заказов */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Мои заказы</CardTitle>
                <CardDescription>
                  История и статус ваших заказов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">У вас еще нет заказов</h3>
                  <p className="text-gray-600 mb-4">
                    Сделайте заказ в нашем магазине, чтобы он отобразился здесь
                  </p>
                  <Button>Перейти в магазин</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка избранного */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Избранное</CardTitle>
                <CardDescription>
                  Сохраненные товары и услуги
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Список избранного пуст</h3>
                  <p className="text-gray-600 mb-4">
                    Добавьте товары или услуги в избранное, чтобы они отображались здесь
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline">Смотреть услуги</Button>
                    <Button>Перейти в магазин</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка настроек */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
                <CardDescription>
                  Управляйте настройками своего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Уведомления</h3>
                  <p className="text-gray-600 mb-4">
                    Настройте получение уведомлений
                  </p>
                  <Separator className="my-4" />
                  <p className="text-sm text-gray-500">
                    Пока что настройки уведомлений недоступны.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Безопасность</h3>
                  <p className="text-gray-600 mb-4">
                    Настройки безопасности аккаунта
                  </p>
                  <Separator className="my-4" />
                  <Button variant="outline">Сменить пароль</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
