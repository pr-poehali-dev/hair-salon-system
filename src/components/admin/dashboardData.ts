
import { products } from "@/data/products";
import { services, staffMembers } from "@/data/services";

// Типы данных
export interface RevenueDataPoint {
  name: string;
  services: number;
  products: number;
}

export interface VisitorDataPoint {
  name: string;
  value: number;
}

export interface ServiceCategoryDataPoint {
  name: string;
  value: number;
}

// Моковые данные для графиков
export const revenueData: RevenueDataPoint[] = [
  { name: 'Янв', services: 20000, products: 15000 },
  { name: 'Фев', services: 25000, products: 18000 },
  { name: 'Мар', services: 30000, products: 20000 },
  { name: 'Апр', services: 28000, products: 22000 },
  { name: 'Май', services: 32000, products: 25000 },
  { name: 'Июн', services: 35000, products: 28000 },
];

export const visitorsData: VisitorDataPoint[] = [
  { name: 'Пн', value: 45 },
  { name: 'Вт', value: 52 },
  { name: 'Ср', value: 49 },
  { name: 'Чт', value: 63 },
  { name: 'Пт', value: 85 },
  { name: 'Сб', value: 120 },
  { name: 'Вс', value: 95 },
];

export const serviceByCategory: ServiceCategoryDataPoint[] = [
  { name: 'Стрижки', value: 35 },
  { name: 'Окрашивание', value: 25 },
  { name: 'Укладка', value: 15 },
  { name: 'Уходовые процедуры', value: 10 },
  { name: 'Наращивание', value: 8 },
  { name: 'Мужской зал', value: 7 },
];

// Цвета для графиков
export const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#af19ff', '#ff6b6b'];

// Моковая статистика заказов
export const totalAppointments = 86;
export const pendingAppointments = 12;

// Утилиты для вычисления статистики
export const calculateStatistics = () => {
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

  return {
    totalProducts,
    totalServices,
    totalStaff,
    inStockProducts,
    averageServicePrice,
    averageProductPrice
  };
};
