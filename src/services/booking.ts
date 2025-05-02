
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface BookingType {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
}

// Моковые данные записей
const mockBookings: BookingType[] = [
  {
    id: 'BK-1001',
    userId: '2',
    serviceId: 'haircut-women',
    serviceName: 'Женская стрижка',
    staffId: 'stylist-1',
    staffName: 'Анна Петрова',
    date: format(new Date(2025, 4, 15), 'yyyy-MM-dd'),
    time: '14:00',
    duration: 60,
    price: 2500,
    status: 'confirmed',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: format(new Date(2025, 4, 1), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'BK-1002',
    userId: '2',
    serviceId: 'coloring-single',
    serviceName: 'Окрашивание в один тон',
    staffId: 'stylist-4',
    staffName: 'Мария Иванова',
    date: format(new Date(2025, 4, 25), 'yyyy-MM-dd'),
    time: '11:30',
    duration: 120,
    price: 4500,
    status: 'pending',
    paymentMethod: 'cash',
    paymentStatus: 'unpaid',
    createdAt: format(new Date(2025, 4, 5), 'yyyy-MM-dd HH:mm:ss'),
  },
];

// Получение записей пользователя
export const getUserBookings = (userId: string): Promise<BookingType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = mockBookings.filter((booking) => booking.userId === userId);
      resolve(bookings);
    }, 500);
  });
};

// Создание новой записи
export const createBooking = (bookingData: Omit<BookingType, 'id' | 'createdAt'>): Promise<BookingType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBooking: BookingType = {
        ...bookingData,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
      mockBookings.push(newBooking);
      resolve(newBooking);
    }, 1000);
  });
};

// Отмена записи
export const cancelBooking = (bookingId: string): Promise<BookingType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookingIndex = mockBookings.findIndex((booking) => booking.id === bookingId);
      if (bookingIndex !== -1) {
        const updatedBooking = {
          ...mockBookings[bookingIndex],
          status: 'cancelled' as const,
        };
        mockBookings[bookingIndex] = updatedBooking;
        resolve(updatedBooking);
      } else {
        reject(new Error('Запись не найдена'));
      }
    }, 500);
  });
};

// Форматирование даты записи
export const formatBookingDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'PPP', { locale: ru });
};

// Определение цвета статуса записи
export const getStatusColor = (status: BookingType['status']): string => {
  switch (status) {
    case 'confirmed':
      return 'text-green-600';
    case 'pending':
      return 'text-amber-600';
    case 'completed':
      return 'text-blue-600';
    case 'cancelled':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Получение текста статуса записи
export const getStatusText = (status: BookingType['status']): string => {
  switch (status) {
    case 'confirmed':
      return 'Подтверждена';
    case 'pending':
      return 'В обработке';
    case 'completed':
      return 'Выполнена';
    case 'cancelled':
      return 'Отменена';
    default:
      return 'Неизвестный статус';
  }
};
