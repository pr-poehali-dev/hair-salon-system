
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { name, avatar, rating, date, comment, service } = testimonial;

  // Получаем инициалы для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        
        {service && (
          <p className="text-sm text-gray-600 mb-2">
            Услуга: <span className="font-medium">{service}</span>
          </p>
        )}
        
        <p className="text-gray-700">{comment}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
