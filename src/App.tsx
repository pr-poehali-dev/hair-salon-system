
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
