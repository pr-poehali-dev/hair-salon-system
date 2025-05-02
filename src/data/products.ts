
import { ProductType } from "@/components/ProductCard";

// Моковые данные для категорий
export const categories = [
  { id: "hair-care", name: "Уход за волосами" },
  { id: "styling", name: "Стайлинг" },
  { id: "treatment", name: "Лечение" },
  { id: "coloring", name: "Окрашивание" },
  { id: "accessories", name: "Аксессуары" },
];

// Моковые данные для брендов
export const brands = [
  { id: "loreal", name: "L'Oréal Professionnel" },
  { id: "kerastase", name: "Kérastase" },
  { id: "redken", name: "Redken" },
  { id: "wella", name: "Wella Professionals" },
  { id: "moroccanoil", name: "Moroccanoil" },
];

// Моковые данные для фильтра сортировки
export const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "priceAsc", label: "Сначала дешевле" },
  { value: "priceDesc", label: "Сначала дороже" },
  { value: "newest", label: "Новинки" },
  { value: "discount", label: "По размеру скидки" },
];

// Моковые данные товаров
export const products: ProductType[] = [
  {
    id: 1,
    title: "Шампунь для окрашенных волос L'Oréal Professionnel",
    description: "Шампунь для окрашенных волос помогает сохранить яркость цвета и защищает от вымывания.",
    price: 1500,
    discountPrice: 1290,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "loreal-color-shampoo",
    category: "hair-care",
    rating: 4.8,
    inStock: true,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 2,
    title: "Маска для восстановления волос Kérastase",
    description: "Интенсивная маска глубоко восстанавливает поврежденные волосы, возвращая им силу и блеск.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "kerastase-repair-mask",
    category: "treatment",
    rating: 4.9,
    inStock: true,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 3,
    title: "Масло для волос Moroccanoil",
    description: "Аргановое масло для всех типов волос. Увлажняет, питает и защищает волосы от негативных факторов внешней среды.",
    price: 2800,
    discountPrice: 2380,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "moroccanoil-treatment",
    category: "treatment",
    rating: 4.7,
    inStock: true,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 4,
    title: "Спрей для термозащиты Redken",
    description: "Защищает волосы от повреждений при использовании термоприборов до 232°C.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "redken-heat-protection",
    category: "styling",
    rating: 4.5,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 5,
    title: "Краска для волос Wella Koleston Perfect",
    description: "Профессиональная краска для волос с технологией чистого цвета для стойкого и равномерного окрашивания.",
    price: 980,
    image: "https://images.unsplash.com/photo-1585870683904-956a840ac472?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "wella-koleston-color",
    category: "coloring",
    rating: 4.6,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Щетка для волос Mason Pearson",
    description: "Легендарная щетка ручной работы с натуральной щетиной для бережного расчесывания и массажа кожи головы.",
    price: 12500,
    discountPrice: 10990,
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "mason-pearson-brush",
    category: "accessories",
    rating: 4.9,
    inStock: false,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 7,
    title: "Сыворотка для секущихся кончиков Kérastase",
    description: "Несмываемая сыворотка запечатывает секущиеся кончики и предотвращает их повторное появление.",
    price: 2100,
    image: "https://images.unsplash.com/photo-1631730486572-281df9878126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "kerastase-split-ends-serum",
    category: "treatment",
    rating: 4.3,
    inStock: true,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 8,
    title: "Текстурирующий спрей для объема L'Oréal Professionnel",
    description: "Создает естественный объем и текстуру, подходит для всех типов волос.",
    price: 1600,
    image: "https://images.unsplash.com/photo-1626273569414-a22f3d4c181d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "loreal-texture-spray",
    category: "styling",
    rating: 4.2,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 9,
    title: "Набор для окрашивания бровей и ресниц",
    description: "Профессиональный набор для окрашивания бровей и ресниц в домашних условиях.",
    price: 2950,
    discountPrice: 2500,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "eyebrow-eyelash-dye-kit",
    category: "coloring",
    rating: 4.0,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 10,
    title: "Расческа-выпрямитель для волос",
    description: "Электрическая расческа с керамическим покрытием для быстрого выпрямления волос.",
    price: 5600,
    image: "https://images.unsplash.com/photo-1636108840454-9d5370d5e106?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "straightening-brush",
    category: "accessories",
    rating: 4.4,
    inStock: true,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 11,
    title: "Шампунь для объема тонких волос Redken",
    description: "Придает объем и легкость тонким волосам, не утяжеляя их.",
    price: 1400,
    image: "https://images.unsplash.com/photo-1626273569414-a22f3d4c181d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "redken-volume-shampoo",
    category: "hair-care",
    rating: 4.5,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 12,
    title: "Воск для укладки волос Wella",
    description: "Средство для создания текстуры и фиксации прически с матовым эффектом.",
    price: 1100,
    image: "https://images.unsplash.com/photo-1631730486511-5d92e672bd8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "wella-styling-wax",
    category: "styling",
    rating: 4.2,
    inStock: true,
    isNew: false,
    isBestseller: false,
  },
];

// Получение товара по slug
export const getProductBySlug = (slug: string): ProductType | undefined => {
  return products.find(product => product.slug === slug);
};

// Получение похожих товаров по категории
export const getSimilarProducts = (currentProduct: ProductType, limit: number = 4): ProductType[] => {
  return products
    .filter(product => 
      product.category === currentProduct.category && 
      product.id !== currentProduct.id
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};
