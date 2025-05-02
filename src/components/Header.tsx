
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scissors, ShoppingBag, User } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-playfair text-xl font-bold">ГламурШик</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Главная
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-primary transition-colors">
            Услуги
          </Link>
          <Link to="/shop" className="text-gray-700 hover:text-primary transition-colors">
            Магазин
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
            О нас
          </Link>
          <Link to="/contacts" className="text-gray-700 hover:text-primary transition-colors">
            Контакты
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="text-gray-700 hover:text-primary relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Войти</span>
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Записаться
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Магазин
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className="text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <div className="flex items-center space-x-4 pt-2">
              <Link to="/cart" className="text-gray-700 hover:text-primary relative">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Войти</span>
                </Button>
              </Link>
            </div>
            <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                Записаться
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
