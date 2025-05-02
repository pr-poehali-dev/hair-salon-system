
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

// Данные о услугах
const allServices = [
  // Стрижки и укладки
  {
    id: 1,
    title: "Женская стрижка",
    description: "Профессиональная стрижка с учетом типа волос, формы лица и ваших пожеланий. Включает консультацию и укладку.",
    price: "от 2000 ₽",
    image: "https://images.unsplash.com/photo-1559599076-9c61d8e1b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "womens-haircut",
    category: "haircuts"
  },
  {
    id: 2,
    title: "Мужская стрижка",
    description: "Классическая или модельная стрижка с учетом индивидуальных особенностей. Включает укладку.",
    price: "от 1500 ₽",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "mens-haircut",
    category: "haircuts"
  },
  {
    id: 3,
    title: "Детская стрижка",
    description: "Бережная и аккуратная стрижка для детей с учетом возрастных особенностей.",
    price: "от 1000 ₽",
    image: "https://images.unsplash.com/photo-1533007716222-4b465613a984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "kids-haircut",
    category: "haircuts"
  },
  {
    id: 4,
    title: "Укладка волос",
    description: "Профессиональная укладка для создания повседневного или вечернего образа.",
    price: "от 1500 ₽",
    image: "https://images.unsplash.com/photo-1595888156793-1654fdb77744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "hair-styling",
    category: "haircuts"
  },
  
  // Окрашивание
  {
    id: 5,
    title: "Однотонное окрашивание",
    description: "Окрашивание волос в один тон с использованием премиальных красителей.",
    price: "от 3000 ₽",
    image: "https://images.unsplash.com/photo-1595499229599-5b3c0b86bebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "single-color",
    category: "coloring"
  },
  {
    id: 6,
    title: "Мелирование",
    description: "Частичное окрашивание волос для создания эффекта осветленных прядей.",
    price: "от 3500 ₽",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "highlights",
    category: "coloring"
  },
  {
    id: 7,
    title: "Сложное окрашивание",
    description: "Креативное окрашивание: омбре, балаяж, шатуш и другие современные техники.",
    price: "от 5000 ₽",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "complex-coloring",
    category: "coloring"
  },
  
  // Уход за волосами
  {
    id: 8,
    title: "Spa-уход для волос",
    description: "Интенсивный восстанавливающий уход с использованием профессиональных масок и сывороток.",
    price: "от 2500 ₽",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "hair-spa",
    category: "treatments"
  },
  {
    id: 9,
    title: "Кератиновое выпрямление",
    description: "Процедура для выпрямления и восстановления волос с эффектом на 3-5 месяцев.",
    price: "от 7000 ₽",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "keratin-treatment",
    category: "treatments"
  },
  
  // Маникюр и педикюр
  {
    id: 10,
    title: "Маникюр классический",
    description: "Обработка ногтей и кутикулы с последующим покрытием гель-лаком.",
    price: "от 1200 ₽",
    image: "https://images.unsplash.com/photo-1595621864080-676ea59cd0d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "classic-manicure",
    category: "nails"
  },
  {
    id: 11,
    title: "Педикюр",
    description: "Комплексный уход за ногтями и кожей стоп с покрытием гель-лаком.",
    price: "от 2000 ₽",
    image: "https://images.unsplash.com/photo-1581579438747-25551a2c05e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "pedicure",
    category: "nails"
  },
  {
    id: 12,
    title: "Дизайн ногтей",
    description: "Создание уникального дизайна на ваших ногтях: стразы, втирка, рисунки.",
    price: "от 500 ₽",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    slug: "nail-design",
    category: "nails"
  }
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Фильтрация услуг по поиску и категории
  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || service.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">Наши услуги</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Мы предлагаем широкий спектр услуг для ухода за вашей внешностью. Наши опытные мастера помогут вам выглядеть и чувствовать себя наилучшим образом.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="relative max-w-md mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск услуг..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-3xl mx-auto flex justify-between mb-8 bg-gray-100">
              <TabsTrigger value="all" className="flex-1">Все услуги</TabsTrigger>
              <TabsTrigger value="haircuts" className="flex-1">Стрижки и укладки</TabsTrigger>
              <TabsTrigger value="coloring" className="flex-1">Окрашивание</TabsTrigger>
              <TabsTrigger value="treatments" className="flex-1">Уход</TabsTrigger>
              <TabsTrigger value="nails" className="flex-1">Маникюр</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">Услуги не найдены</h3>
                  <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
                  <Button onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </TabsContent>

            {["haircuts", "coloring", "treatments", "nails"].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((service) => (
                      <ServiceCard key={service.id} {...service} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2">Услуги не найдены</h3>
                    <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
                    <Button onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
                      Сбросить фильтры
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
            Не нашли то, что искали?
          </h2>
          <p className="mb-6 max-w-xl mx-auto">
            Свяжитесь с нами, и мы обсудим ваши индивидуальные пожелания. Мы всегда готовы предложить персонализированные решения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Позвонить нам
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Записаться онлайн
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
