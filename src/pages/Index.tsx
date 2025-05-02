
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scissors, Sparkles, Zap, Leaf, ChevronRight } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';

const Index = () => {
  // Популярные услуги
  const featuredServices = [
    {
      title: 'Стрижка и укладка',
      description: 'Профессиональная стрижка и укладка волос с учетом ваших пожеланий и типа волос.',
      price: 'от 1500 ₽',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      slug: 'haircut'
    },
    {
      title: 'Окрашивание',
      description: 'Создайте свой неповторимый стиль с помощью профессионального окрашивания волос.',
      price: 'от 3000 ₽',
      image: 'https://images.unsplash.com/photo-1595499229599-5b3c0b86bebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      slug: 'coloring'
    },
    {
      title: 'Маникюр',
      description: 'Ухоженные руки — ваша визитная карточка. Маникюр с использованием премиальных материалов.',
      price: 'от 1200 ₽',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      slug: 'manicure'
    }
  ];

  // Отзывы клиентов
  const testimonials = [
    {
      name: 'Анна К.',
      rating: 5,
      comment: 'Превосходный сервис! Мастер внимательно выслушала мои пожелания и сделала именно то, что я хотела. Очень довольна результатом!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      date: '15 апреля 2025'
    },
    {
      name: 'Максим П.',
      rating: 4,
      comment: 'Отличная парикмахерская с приятной атмосферой. Мастер профессионально подобрал стрижку под форму лица. Приду снова!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      date: '2 мая 2025'
    },
    {
      name: 'Елена В.',
      rating: 5,
      comment: 'Делала окрашивание волос. Результат превзошел все ожидания! Цвет получился именно таким, как я хотела. Спасибо мастеру за профессионализм!',
      image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      date: '28 апреля 2025'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-section h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold font-playfair mb-4">
              Создайте свой идеальный образ
            </h1>
            <p className="text-xl mb-8">
              Наши мастера помогут вам раскрыть вашу естественную красоту и создать неповторимый стиль
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Записаться онлайн
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white">
                  Наши услуги
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4">
              Почему клиенты выбирают нас
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              В ГламурШик мы стремимся предоставить вам непревзойденный опыт и результаты, которыми вы будете гордиться
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Профессиональные мастера</h3>
              <p className="text-gray-600">
                Наши мастера — профессионалы с многолетним опытом работы и регулярным повышением квалификации
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Премиальные продукты</h3>
              <p className="text-gray-600">
                Мы используем только высококачественную косметику ведущих мировых брендов
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Современные технологии</h3>
              <p className="text-gray-600">
                Мы следим за новейшими тенденциями и используем передовые технологии в работе
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-2">Экологичный подход</h3>
              <p className="text-gray-600">
                Мы заботимся об окружающей среде и используем экологически чистые продукты
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">
                Наши услуги
              </h2>
              <p className="text-gray-600">
                Выберите услуги, которые подойдут именно вам
              </p>
            </div>
            <Link to="/services" className="flex items-center text-primary hover:underline">
              <span>Все услуги</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">
              Отзывы наших клиентов
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Узнайте, что говорят о нас клиенты, которые уже воспользовались нашими услугами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4 text-white">
            Готовы к преображению?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Запишитесь на консультацию или процедуру прямо сейчас и получите скидку 10% на первое посещение
          </p>
          <Link to="/booking">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Записаться сейчас
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
