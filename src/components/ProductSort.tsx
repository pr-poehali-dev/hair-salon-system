
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface ProductSortProps {
  options: SortOption[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const ProductSort = ({ options, selectedOption, onChange }: ProductSortProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Сортировать:</span>
      <Select value={selectedOption} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
