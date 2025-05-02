
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Sidebar } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { useAdminGuard } from '@/hooks/use-admin-guard';
import AdminDashboard from '@/components/AdminDashboard';
import { services, staffMembers, formatPrice, formatDuration } from '@/data/services';
import { products } from '@/data/products';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Package, 
  Scissors, 
  Clock, 
  Search, 
  PlusCircle,
  Pencil,
  Trash2,
  Calendar,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const AdminPanel = () => {
  const { isAdmin, loading } = useAdminGuard();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serviceSearch, setServiceSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string | number, type: string, name: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Создаем элементы для боковой навигации
  const sidebarItems = [
    {
      title: "Дашборд",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Услуги",
      href: "/admin?tab=services",
      icon: Scissors,
    },
    {
      title: "Товары",
      href: "/admin?tab=products",
      icon: ShoppingBag,
    },
    {
      title: "Персонал",
      href: "/admin?tab=staff",
      icon: Users,
    },
    {
      title: "Записи",
      href: "/admin?tab=appointments",
      icon: Calendar,
    },
    {
      title: "Настройки",
      href: "/admin?tab=settings",
      icon: Settings,
      disabled: true,
    },
    {
      title: "Выйти",
      href: "/",
      icon: LogOut,
      onClick: () => logout(),
    },
  ];

  // Обрабатываем параметры URL для определения активной вкладки
  useState(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  });

  // Фильтрация услуг
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Фильтрация продуктов
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Фильтрация персонала
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Обработчик для нажатия на кнопку удаления
  const handleDeleteClick = (id: string | number, type: string, name: string) => {
    setItemToDelete({ id, type, name });
    setIsDeleteDialogOpen(true);
  };

  // Обработчик для подтверждения удаления
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // В реальном приложении здесь был бы запрос к API
      console.log(`Удаление ${itemToDelete.type} с ID ${itemToDelete.id}`);
      // Закрываем диалог
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Если все еще идет проверка или пользователь не администратор, показываем состояние загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Если пользователь не администратор, хук useAdminGuard перенаправит его
  if (!isAdmin) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Боковая навигация */}
      <aside className="hidden md:block w-64 border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Админ панель</h2>
          <p className="text-sm text-muted-foreground">Управление салоном красоты</p>
        </div>
        <Sidebar items={sidebarItems} />
      </aside>
      
      {/* Основное содержимое */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline-block">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin?tab=services')}
            >
              <Scissors className="h-4 w-4" />
              <span className="hidden sm:inline-block">Услуги</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin?tab=products')}
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline-block">Товары</span>
            </TabsTrigger>
            <TabsTrigger 
              value="staff" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin?tab=staff')}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline-block">Персонал</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appointments" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin?tab=appointments')}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline-block">Записи</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Дашборд */}
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          {/* Услуги */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Управление услугами</CardTitle>
                  <CardDescription>
                    Здесь вы можете добавлять, редактировать и удалять услуги салона
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
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
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                </div>
                
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
                      {filteredServices.map((service) => (
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
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-destructive"
                                onClick={() => handleDeleteClick(service.id, 'услугу', service.title)}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Товары */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Управление товарами</CardTitle>
                  <CardDescription>
                    Здесь вы можете добавлять, редактировать и удалять товары магазина
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Добавить товар</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Поиск товаров..."
                    className="pl-8"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="w-8 h-8 rounded object-cover" 
                              />
                              <span>{product.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {product.discountPrice ? (
                              <div>
                                <span className="line-through text-gray-500 mr-2">
                                  {product.price} ₽
                                </span>
                                <span className="text-primary font-medium">
                                  {product.discountPrice} ₽
                                </span>
                              </div>
                            ) : (
                              `${product.price} ₽`
                            )}
                          </TableCell>
                          <TableCell>
                            {product.inStock ? (
                              <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">В наличии</Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">Нет в наличии</Badge>
                            )}
                            {product.isNew && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Новинка</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-destructive"
                                onClick={() => handleDeleteClick(product.id, 'товар', product.title)}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Персонал */}
          <TabsContent value="staff">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Управление персоналом</CardTitle>
                  <CardDescription>
                    Здесь вы можете добавлять, редактировать и удалять информацию о мастерах
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
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
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStaff.map((staff) => (
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
                          <Button size="sm" variant="outline">
                            <Pencil className="h-3 w-3 mr-1" />
                            Изменить
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(staff.id, 'сотрудника', staff.name)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Записи */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Управление записями клиентов</CardTitle>
                <CardDescription>
                  Здесь вы можете просматривать и управлять записями клиентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center">
                  <p className="text-gray-600 mb-4">В разработке...</p>
                  <Button>Добавить запись вручную</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить {itemToDelete?.type} "{itemToDelete?.name}"?
              Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
