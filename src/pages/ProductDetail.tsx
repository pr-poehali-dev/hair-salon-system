
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  CreditCard, 
  RefreshCw, 
  Star,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductGallery from "@/components/ProductGallery";
import ProductCard, { ProductType } from "@/components/ProductCard";
import { getProductBySlug, getSimilarProducts } from "@/data/products";
import { toast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    const foundProduct = getProductBySlug(slug);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Получаем похожие товары
      const similar = getSimilarProducts(foundProduct, 3);
      setSimilarProducts(similar);
    } else {
      // Если товар не найден, перенаправляем на страницу магазина
      navigate("/shop");
      toast({
        title: "Товар не найден",
        description: "К сожалению, запрашиваемый товар не существует",
        variant: "destructive",
      });
    }
  }, [slug, navigate]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-medium mb-2">Загрузка товара...</h2>
      </div>
    );
  }

  // Созданние массива изображений для галереи
  // В реальном проекте у каждого товара будет несколько изображений
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  const handleAddToCart = () => {
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.title} (${quantity} шт.) добавлен в корзину`,
      duration: 3000,
    });
    // Здесь будет логика добавления в корзину
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToFavorites = () => {
    toast({
      title: "Товар добавлен в избранное",
      description: `${product.title} добавлен в избранное`,
      duration: 3000,
    });
    // Здесь будет логика добавления в избранное
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Навигационные хлебные крошки */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Магазин</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.title}</span>
        </div>

        {/* Основной блок информации о товаре */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Галерея изображений */}
          <div>
            <ProductGallery images={productImages} title={product.title} />
          </div>

          {/* Информация о товаре */}
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold mb-2">{product.title}</h1>
            
            {/* Рейтинг */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} (24 отзыва)</span>
            </div>
            
            {/* Цена */}
            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-primary text-2xl font-bold">{product.discountPrice.toLocaleString()} ₽</span>
                  <span className="text-gray-500 line-through text-lg">{product.price.toLocaleString()} ₽</span>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Скидка {Math.round((1 - product.discountPrice / product.price) * 100)}%
                  </Badge>
                </div>
              ) : (
                <span className="text-primary text-2xl font-bold">{product.price.toLocaleString()} ₽</span>
              )}
            </div>
            
            {/* Метки товара */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  Новинка
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  Хит продаж
                </Badge>
              )}
            </div>
            
            {/* Описание */}
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            {/* Наличие */}
            <div className="flex items-center mb-6">
              {product.inStock ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>В наличии</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-500">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Нет в наличии</span>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            {/* Блок добавления в корзину */}
            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex border rounded-md">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-14 h-10 border-x text-center focus:outline-none"
                  />
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Добавить в корзину</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-12 h-10 p-0 flex items-center justify-center"
                  onClick={handleAddToFavorites}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button className="w-full gap-2" disabled>
                <ShoppingBag className="h-5 w-5" />
                <span>Нет в наличии</span>
              </Button>
            )}
            
            {/* Информация о доставке */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Доставка</h4>
                  <p className="text-sm text-gray-600">Бесплатная доставка при заказе от 3000 ₽</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Оплата</h4>
                  <p className="text-sm text-gray-600">Картой онлайн, наличными или картой при получении</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Возврат</h4>
                  <p className="text-sm text-gray-600">14 дней на возврат товара надлежащего качества</p>
                </div>
              </div>
            </div>
            
            {/* Поделиться */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Поделиться:</span>
              <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Вкладки с дополнительной информацией */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="characteristics">Характеристики</TabsTrigger>
              <TabsTrigger value="shipping">Доставка и оплата</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-0">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-playfair font-semibold mb-4">Подробное описание</h3>
                <p className="mb-4">
                  {product.description} Это инновационное средство специально разработано для ухода за вашими волосами. 
                  Благодаря уникальной формуле с активными компонентами, оно обеспечивает глубокое питание и восстановление.
                </p>
                <p className="mb-4">
                  Продукт не содержит сульфатов, парабенов и силиконов, что делает его безопасным для регулярного использования.
                  Подходит для всех типов волос, особенно рекомендуется для окрашенных, поврежденных и сухих волос.
                </p>
                <h4 className="text-lg font-medium mb-2">Преимущества:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Глубоко увлажняет и питает волосы</li>
                  <li>Защищает от термического воздействия</li>
                  <li>Придает блеск и шелковистость</li>
                  <li>Предотвращает сечение кончиков</li>
                  <li>Не утяжеляет волосы</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="characteristics" className="mt-0">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-playfair font-semibold mb-4">Характеристики</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Бренд:</span>
                      <span className="w-1/2">L'Oréal Professionnel</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Объем:</span>
                      <span className="w-1/2">250 мл</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Тип волос:</span>
                      <span className="w-1/2">Для всех типов волос</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Страна производства:</span>
                      <span className="w-1/2">Франция</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Артикул:</span>
                      <span className="w-1/2">LP2022-{product.id}</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-md">
                      <span className="font-medium w-1/2">Срок годности:</span>
                      <span className="w-1/2">24 месяца</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-0">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-playfair font-semibold mb-4">Доставка и оплата</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Способы доставки:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Курьерская доставка по Москве и Санкт-Петербургу — от 300 ₽</li>
                      <li>Самовывоз из салона — бесплатно</li>
                      <li>Почта России — от 350 ₽</li>
                      <li>СДЭК — от 400 ₽</li>
                    </ul>
                    <p className="mt-2 text-green-600 font-medium">
                      Бесплатная доставка при заказе от 3000 ₽
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Способы оплаты:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Онлайн-оплата банковской картой</li>
                      <li>Оплата наличными при получении</li>
                      <li>Оплата картой при получении</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-playfair font-semibold">Отзывы (24)</h3>
                  <Button>Оставить отзыв</Button>
                </div>
                
                <div className="space-y-6">
                  {/* Будет заменено на компонент с отзывами */}
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Анна К.</h4>
                      <span className="text-sm text-gray-500">15 апреля 2025</span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 5 ? "text-gold fill-gold" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      Отличное средство! Волосы стали заметно более мягкими и блестящими. 
                      Рекомендую всем, кто хочет улучшить состояние своих волос.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Максим П.</h4>
                      <span className="text-sm text-gray-500">2 мая 2025</span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "text-gold fill-gold" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">
                      Хороший продукт, но цена немного завышена. Есть аналоги дешевле с таким же эффектом. 
                      В целом, качество на высоте.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">Показать больше отзывов</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Похожие товары */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
