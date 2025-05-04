
import { useState, useEffect } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface FilterProps {
  categories: Category[];
  brands: Brand[];
  priceRange: [number, number];
  maxPrice: number;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPriceRange: [number, number];
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const ProductFilter = ({
  categories,
  brands,
  priceRange,
  maxPrice,
  selectedCategories,
  selectedBrands,
  selectedPriceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(selectedPriceRange);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  useEffect(() => {
    setLocalPriceRange(selectedPriceRange);
  }, [selectedPriceRange]);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };

  const handleBrandToggle = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    onBrandChange(newBrands);
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const handlePriceChangeCommitted = () => {
    onPriceRangeChange(localPriceRange);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setMobileFiltersOpen(false);
  };

  // Проверка, есть ли активные фильтры
  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedBrands.length > 0 || 
                          selectedPriceRange[0] !== priceRange[0] || 
                          selectedPriceRange[1] !== priceRange[1];

  // Отображение активных фильтров
  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Активные фильтры:</h3>
        <div className="flex flex-wrap gap-2">
          {/* Активные категории */}
          {selectedCategories.map(catId => {
            const category = categories.find(c => c.id === catId);
            return category ? (
              <Badge key={catId} variant="outline" className="bg-primary/10">
                {category.name}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleCategoryToggle(catId)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          
          {/* Активные бренды */}
          {selectedBrands.map(brandId => {
            const brand = brands.find(b => b.id === brandId);
            return brand ? (
              <Badge key={brandId} variant="outline" className="bg-primary/10">
                {brand.name}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => handleBrandToggle(brandId)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          
          {/* Диапазон цен (если отличается от начального) */}
          {(selectedPriceRange[0] !== priceRange[0] || selectedPriceRange[1] !== priceRange[1]) && (
            <Badge variant="outline" className="bg-primary/10">
              {selectedPriceRange[0]} ₽ - {selectedPriceRange[1]} ₽
            </Badge>
          )}
          
          {/* Кнопка сброса всех фильтров */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            Сбросить все
          </Button>
        </div>
      </div>
    );
  };

  // Render the filter content (used both in desktop and mobile views)
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Активные фильтры */}
      <div className="md:hidden">
        {renderActiveFilters()}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Цена</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={0}
            max={maxPrice}
            step={100}
            value={[localPriceRange[0], localPriceRange[1]]}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeCommitted}
            className="mb-6"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{localPriceRange[0]} ₽</span>
            <span>{localPriceRange[1]} ₽</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>Категории</span>
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-xs">
                  {selectedCategories.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-1">
            <ScrollArea className="h-[150px] pr-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <button
                    onClick={() => handleCategoryToggle(category.id)}
                    className="flex items-center w-full py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                      selectedCategories.includes(category.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                    }`}>
                      {selectedCategories.includes(category.id) && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{category.name}</span>
                  </button>
                </div>
              ))}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Separator />

      <div>
        <Collapsible open={brandsOpen} onOpenChange={setBrandsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>Бренды</span>
              {selectedBrands.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-xs">
                  {selectedBrands.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${brandsOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-1">
            <ScrollArea className="h-[150px] pr-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center">
                  <button
                    onClick={() => handleBrandToggle(brand.id)}
                    className="flex items-center w-full py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                      selectedBrands.includes(brand.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                    }`}>
                      {selectedBrands.includes(brand.id) && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{brand.name}</span>
                  </button>
                </div>
              ))}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block w-full">
        {renderActiveFilters()}
        {renderFilterContent()}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            className="w-full mt-6" 
            onClick={handleClearFilters}
          >
            Сбросить фильтры
          </Button>
        )}
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden w-full">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mb-4 flex items-center gap-2"
              aria-label="Открыть фильтры"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Фильтры</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="rounded-full ml-auto">
                  {selectedCategories.length + selectedBrands.length +
                   (selectedPriceRange[0] !== priceRange[0] || selectedPriceRange[1] !== priceRange[1] ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:w-[350px]">
            <SheetHeader className="mb-2">
              <SheetTitle>Фильтры</SheetTitle>
              <SheetDescription>
                Настройте параметры поиска товаров
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
              <div className="pr-4 pb-8">
                {renderFilterContent()}
              </div>
            </ScrollArea>
            
            <SheetFooter className="mt-4 md:mt-0">
              <Button 
                className="w-full" 
                onClick={() => setMobileFiltersOpen(false)}
              >
                Применить фильтры
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={handleClearFilters}
                >
                  Сбросить фильтры
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {renderActiveFilters()}
      </div>
    </>
  );
};

export default ProductFilter;
