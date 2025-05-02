
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Tag, 
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookingType, getStatusColor, getStatusText } from '@/services/booking';
import { formatDuration, formatPrice } from '@/data/services';

interface BookingCardProps {
  booking: BookingType;
  onCancelBooking?: (bookingId: string) => void;
}

const BookingCard = ({ booking, onCancelBooking }: BookingCardProps) => {
  const {
    id,
    serviceName,
    staffName,
    date,
    time,
    duration,
    price,
    status,
    paymentMethod,
    paymentStatus,
  } = booking;

  const isPastBooking = new Date(`${date}T${time}`) < new Date();
  const canCancel = !isPastBooking && (status === 'confirmed' || status === 'pending');

  // Форматируем дату
  const formattedDate = format(parseISO(date), 'PPP', { locale: ru });

  // Обработчик отмены записи
  const handleCancel = () => {
    if (onCancelBooking && canCancel) {
      onCancelBooking(id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="w-full h-1.5 bg-gray-100">
        <div 
          className={`h-full ${status === 'confirmed' ? 'bg-green-500' : 
                              status === 'pending' ? 'bg-amber-500' : 
                              status === 'completed' ? 'bg-blue-500' : 
                              'bg-red-500'}`} 
          style={{ width: status === 'cancelled' ? '100%' : status === 'completed' ? '100%' : status === 'confirmed' ? '66%' : '33%' }} 
        />
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-lg">{serviceName}</h3>
            <p className="text-gray-600 text-sm">Номер записи: {id}</p>
          </div>
          <Badge 
            variant={status === 'cancelled' ? 'destructive' : 'outline'} 
            className={`mt-2 sm:mt-0 ${getStatusColor(status)}`}
          >
            {getStatusText(status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{time} ({formatDuration(duration)})</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{staffName}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">{formatPrice(price)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Scissors className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
            <span className="text-gray-600">
              Оплата: {paymentMethod === 'online' ? 'Онлайн' : 'В салоне'}
              {paymentStatus === 'paid' && (
                <span className="ml-1 text-green-600">
                  (Оплачено)
                </span>
              )}
            </span>
          </div>

          <div className="flex gap-2">
            {canCancel && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleCancel}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>Отменить</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Вы можете отменить запись не позднее чем за 3 часа до начала</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {status === 'confirmed' && !isPastBooking && (
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span>Подтверждено</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
