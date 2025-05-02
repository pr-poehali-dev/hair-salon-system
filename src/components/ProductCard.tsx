
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  slug: string;
  category: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface ProductCardProps {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { 
    title, 
    description, 
    price, 
    discountPrice, 
    image, 
    slug, 
    inStock, 
    isNew, 
    isBestseller 
  } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/shop/${slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600">
                Новинка
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Хит продаж
              </Badge>
            )}
            {!inStock && (
              <Badge variant="outline" className="bg-white text-gray-700 border-gray-300">
                Нет в наличии
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-end justify-between">
            <div>
              {discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-semibold text-lg">{discountPrice.toLocaleString()} ₽</span>
                  <span className="text-gray-500 line-through text-sm">{price.toLocaleString()} ₽</span>
                </div>
              ) : (
                <span className="text-primary font-semibold text-lg">{price.toLocaleString()} ₽</span>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 flex items-center gap-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">В корзину</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
