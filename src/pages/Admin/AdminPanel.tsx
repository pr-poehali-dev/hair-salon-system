
import { useState } from 'react';
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
import { 
  Users, 
  Package, 
  Scissors, 
  Clock, 
  Search, 
  PlusCircle,
  Pencil,
  Trash2,
  Calendar
} from 'lucide-react';
import { useAdminGuard } from '@/hooks/use-admin-guard';
import { Input } from '@/components/ui/input';
import { services, staffMembers, formatPrice, formatDuration } from '@/data/services';
import { products } from '@/data/products';

const AdminPanel = () => {
  const { isAdmin, loading } = useAdminGuard();
  const [serviceSearch, setServiceSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

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
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 font-playfair">Панель администратора</h1>
        
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span>Услуги</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Товары</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Персонал</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Записи</span>
            </TabsTrigger>
          </TabsList>
          
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
                          <TableCell className="font-medium">{service.title}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>{formatPrice(service.price)}</TableCell>
                          <TableCell>{formatDuration(service.duration)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive">
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
                        <TableHead>В наличии</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.title}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.discountPrice ? (
                              <>
                                <span className="line-through text-gray-500 mr-2">
                                  {product.price} ₽
                                </span>
                                <span className="text-primary font-medium">
                                  {product.discountPrice} ₽
                                </span>
                              </>
                            ) : (
                              `${product.price} ₽`
                            )}
                          </TableCell>
                          <TableCell>
                            {product.inStock ? (
                              <span className="text-green-600">Да</span>
                            ) : (
                              <span className="text-red-600">Нет</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive">
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
                        <p className="text-sm">
                          Услуг: {staff.services.length}
                        </p>
                        <div className="flex justify-end mt-3 gap-2">
                          <Button size="sm" variant="outline">
                            <Pencil className="h-3 w-3 mr-1" />
                            Изменить
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
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
    </div>
  );
};

export default AdminPanel;
