
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductType } from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import ProductSort from "@/components/ProductSort";
import { products, categories, brands, sortOptions } from "@/data/products";
import { toast } from "@/components/ui/use-toast";

const Shop = () => {
  // Состояния для фильтров
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  
  // Найти максимальную цену
  const maxPrice = Math.max(...products.map(product => product.price));

  // Обработка фильтрации товаров
  useEffect(() => {
    let filtered = [...products];
    
    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтр по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Фильтр по брендам
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.category)
      );
    }
    
    // Фильтр по цене
    filtered = filtered.filter(product => {
      const effectivePrice = product.discountPrice || product.price;
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });
    
    // Сортировка
    switch (sort) {
      case "priceAsc":
        filtered.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case "priceDesc":
        filtered.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case "newest":
        filtered = filtered.filter(product => product.isNew).concat(
          filtered.filter(product => !product.isNew)
        );
        break;
      case "discount":
        filtered.sort((a, b) => {
          const discountA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) : 0;
          const discountB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) : 0;
          return discountB - discountA;
        });
        break;
      // По умолчанию "popular" - показывать бестселлеры первыми
      default:
        filtered = filtered.filter(product => product.isBestseller).concat(
          filtered.filter(product => !product.isBestseller)
        );
        break;
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sort]);

  // Сброс всех фильтров
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSort("popular");
  };

  // Добавление товара в корзину
  const handleAddToCart = (product: ProductType) => {
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.title} добавлен в корзину`,
      duration: 3000,
    });
    // Здесь будет логика добавления в корзину
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок страницы */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Магазин</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Профессиональные средства для волос от ведущих мировых брендов. Качество, проверенное мастерами.
          </p>
        </div>

        {/* Поиск */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Фильтры (сайдбар) */}
          <div className="md:col-span-1 order-2 md:order-1">
            <ProductFilter 
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              maxPrice={maxPrice}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedPriceRange={priceRange}
              onCategoryChange={setSelectedCategories}
              onBrandChange={setSelectedBrands}
              onPriceRangeChange={setPriceRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Товары */}
          <div className="md:col-span-3 order-1 md:order-2">
            {/* Сортировка и счетчик товаров */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <p className="text-gray-600 mb-2 md:mb-0">
                Найдено товаров: <span className="font-medium">{filteredProducts.length}</span>
              </p>
              
              <ProductSort 
                options={sortOptions}
                selectedOption={sort}
                onChange={setSort}
              />
            </div>

            {/* Сетка товаров */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Товары не найдены</h3>
                <p className="text-gray-600 mb-6">
                  К сожалению, по вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
                </p>
                <Button onClick={handleClearFilters}>
                  Сбросить все фильтры
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Информационные блоки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2">Бесплатная доставка</h3>
            <p className="text-gray-600">
              При заказе от 3000 рублей доставка по всей России бесплатно
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2">Профессиональная консультация</h3>
            <p className="text-gray-600">
              Наши мастера помогут подобрать средства специально для вас
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="font-playfair text-xl font-semibold mb-2">Только оригинальная продукция</h3>
            <p className="text-gray-600">
              Мы работаем напрямую с официальными дистрибьюторами
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
            Нужна консультация?
          </h2>
          <p className="mb-6 max-w-xl mx-auto">
            Обратитесь к нашим специалистам для подбора подходящих средств для вашего типа волос
          </p>
          <Link to="/contacts">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Связаться с нами
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Shop;
