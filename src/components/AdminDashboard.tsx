
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Package, 
  Scissors, 
  ShoppingBag, 
  Users 
} from "lucide-react";
import { products } from "@/data/products";
import { services, staffMembers } from "@/data/services";

// Моковые данные для графиков
const revenueData = [
  { name: 'Янв', services: 20000, products: 15000 },
  { name: 'Фев', services: 25000, products: 18000 },
  { name: 'Мар', services: 30000, products: 20000 },
  { name: 'Апр', services: 28000, products: 22000 },
  { name: 'Май', services: 32000, products: 25000 },
  { name: 'Июн', services: 35000, products: 28000 },
];

const visitorsData = [
  { name: 'Пн', value: 45 },
  { name: 'Вт', value: 52 },
  { name: 'Ср', value: 49 },
  { name: 'Чт', value: 63 },
  { name: 'Пт', value: 85 },
  { name: 'Сб', value: 120 },
  { name: 'Вс', value: 95 },
];

const serviceByCategory = [
  { name: 'Стрижки', value: 35 },
  { name: 'Окрашивание', value: 25 },
  { name: 'Укладка', value: 15 },
  { name: 'Уходовые процедуры', value: 10 },
  { name: 'Наращивание', value: 8 },
  { name: 'Мужской зал', value: 7 },
];

// Цвета для графиков
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#af19ff', '#ff6b6b'];

const AdminDashboard = () => {
  // Расчет статистики
  const totalProducts = products.length;
  const totalServices = services.length;
  const totalStaff = staffMembers.length;
  
  // Подсчет "в наличии" товаров
  const inStockProducts = products.filter(product => product.inStock).length;
  
  // Расчет средней стоимости услуги
  const averageServicePrice = Math.round(
    services.reduce((acc, service) => acc + service.price, 0) / services.length
  );
  
  // Расчет средней стоимости товара
  const averageProductPrice = Math.round(
    products.reduce((acc, product) => acc + product.price, 0) / products.length
  );

  // Моковая статистика заказов
  const totalAppointments = 86;
  const pendingAppointments = 12;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽158,400</div>
            <p className="text-xs text-muted-foreground">
              +16.5% по сравнению с прошлым месяцем
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Записи клиентов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAppointments} ожидают подтверждения
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Продажи</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Товаров в наличии
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Мастера</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Средняя загрузка: 80%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Выручка</CardTitle>
                <CardDescription>
                  Динамика выручки за последние 6 месяцев
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} ₽`, undefined]}
                      labelFormatter={(value) => `Месяц: ${value}`}
                    />
                    <Bar dataKey="services" fill="#8884d8" name="Услуги" />
                    <Bar dataKey="products" fill="#82ca9d" name="Товары" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Распределение услуг</CardTitle>
                <CardDescription>
                  Популярность категорий услуг
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} записей`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Услуги</CardTitle>
                <CardDescription>Сводная информация об услугах</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Всего услуг</dt>
                    <dd className="text-2xl font-bold">{totalServices}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Средняя цена</dt>
                    <dd className="text-2xl font-bold">{averageServicePrice} ₽</dd>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mt-2">
                      <Scissors className="h-5 w-5 text-primary" />
                      <span>Самая популярная услуга: <strong>Женская стрижка</strong></span>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Товары</CardTitle>
                <CardDescription>Сводная информация о товарах</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Всего товаров</dt>
                    <dd className="text-2xl font-bold">{totalProducts}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Средняя цена</dt>
                    <dd className="text-2xl font-bold">{averageProductPrice} ₽</dd>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mt-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span>В наличии: <strong>{inStockProducts} из {totalProducts}</strong></span>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Клиенты</CardTitle>
                <CardDescription>Посещения за неделю</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={visitorsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Посетители" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Расширенная аналитика</CardTitle>
              <CardDescription>
                Эта функция находится в разработке
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Функция в разработке</h3>
                <p className="text-gray-500">
                  Скоро здесь появится расширенная аналитика с детальными отчетами по всем направлениям бизнеса
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Отчеты</CardTitle>
              <CardDescription>
                Эта функция находится в разработке
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Функция в разработке</h3>
                <p className="text-gray-500">
                  Скоро здесь появится возможность формирования различных отчетов
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
