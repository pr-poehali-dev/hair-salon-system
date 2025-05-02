
import { useState, useEffect } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
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
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = useState(true);
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

  // Render the filter content (used both in desktop and mobile views)
  const renderFilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Цена</h3>
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
          <div className="flex justify-between text-sm text-gray-600">
            <span>{localPriceRange[0]} ₽</span>
            <span>{localPriceRange[1]} ₽</span>
          </div>
        </div>
      </div>

      <div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium">
            <span>Категории</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className="flex items-center w-full py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                    selectedCategories.includes(category.id) ? 'bg-primary border-primary text-white' : 'border-gray-300'
                  }`}>
                    {selectedCategories.includes(category.id) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{category.name}</span>
                </button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium">
            <span>Бренды</span>
            <ChevronDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <button
                  onClick={() => handleBrandToggle(brand.id)}
                  className="flex items-center w-full py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                    selectedBrands.includes(brand.id) ? 'bg-primary border-primary text-white' : 'border-gray-300'
                  }`}>
                    {selectedBrands.includes(brand.id) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{brand.name}</span>
                </button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleClearFilters}
      >
        Сбросить фильтры
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block w-full">
        {renderFilterContent()}
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden w-full">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Фильтры</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:w-[350px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Фильтры</SheetTitle>
              <SheetDescription>
                Настройте параметры поиска товаров
              </SheetDescription>
            </SheetHeader>
            {renderFilterContent()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ProductFilter;
