
import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service, formatDuration, formatPrice } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "compact";
}

const ServiceCard = ({ service, variant = "default" }: ServiceCardProps) => {
  const { id, title, description, price, duration, category, image } = service;

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDuration(duration)}</span>
            </div>
            <span className="font-semibold text-primary">{formatPrice(price)}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <Badge variant="outline" className="mb-2">
          {category}
        </Badge>
        <h3 className="font-medium text-xl mb-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(duration)}</span>
          </div>
          <span className="font-semibold text-lg text-primary">{formatPrice(price)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/booking?service=${id}`} className="w-full">
          <Button variant="default" className="w-full">
            Записаться
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
