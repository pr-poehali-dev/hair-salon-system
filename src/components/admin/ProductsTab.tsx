
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Pencil, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import { productsApi } from '@/services/admin-api';
import { useApiData } from '@/hooks/use-api-data';
import { useToast } from '@/hooks/use-toast';

interface ProductsTabProps {
  onDeleteClick: (id: string | number, type: string, name: string) => void;
}

const ProductsTab = ({ onDeleteClick }: ProductsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const {
    data: products,
    loading,
    error,
    refresh,
    setParams
  } = useApiData<Product>({
    fetchFn: productsApi.getAll,
    initialParams: { perPage: 20 },
    immediate: true,
  });

  // Обработчик поиска с задержкой (debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setParams({ search: searchTerm, page: 1 });
      } else {
        setParams({ search: undefined, page: 1 });
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, setParams]);

  // Обработчик добавления товара
  const handleAddProduct = () => {
    toast({
      title: "Функция в разработке",
      description: "Добавление товаров будет доступно в следующей версии",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Управление товарами</CardTitle>
          <CardDescription>
            Здесь вы можете добавлять, редактировать и удалять товары магазина
          </CardDescription>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddProduct}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading && (
          <div className="py-10 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            <span className="ml-2 text-gray-500">Загрузка товаров...</span>
          </div>
        )}
        
        {error && (
          <div className="py-10 flex justify-center items-center text-destructive">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</span>
          </div>
        )}
        
        {!loading && !error && products && products.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>Товары не найдены</p>
            {searchTerm && (
              <p className="mt-2">Попробуйте изменить параметры поиска</p>
            )}
          </div>
        )}
        
        {!loading && !error && products && products.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-8 h-8 rounded object-cover" 
                        />
                        <span>{product.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div>
                          <span className="line-through text-gray-500 mr-2">
                            {product.price} ₽
                          </span>
                          <span className="text-primary font-medium">
                            {product.discountPrice} ₽
                          </span>
                        </div>
                      ) : (
                        `${product.price} ₽`
                      )}
                    </TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">В наличии</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">Нет в наличии</Badge>
                      )}
                      {product.isNew && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Новинка</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => {
                            toast({
                              title: "Функция в разработке",
                              description: "Редактирование товаров будет доступно в следующей версии",
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive"
                          onClick={() => onDeleteClick(product.id, 'товар', product.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
