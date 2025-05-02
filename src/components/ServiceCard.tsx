
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  slug: string;
}

const ServiceCard = ({ title, description, price, image, slug }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden service-card transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-playfair text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">{price}</span>
          <Link to={`/services/${slug}`}>
            <Button variant="outline" className="hover:bg-primary hover:text-white">
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
