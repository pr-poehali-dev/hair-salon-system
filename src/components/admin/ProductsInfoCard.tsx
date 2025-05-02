
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface ProductsInfoCardProps {
  totalProducts: number;
  inStockProducts: number;
  averageProductPrice: number;
}

const ProductsInfoCard = ({ 
  totalProducts, 
  inStockProducts, 
  averageProductPrice 
}: ProductsInfoCardProps) => {
  return (
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
  );
};

export default ProductsInfoCard;
