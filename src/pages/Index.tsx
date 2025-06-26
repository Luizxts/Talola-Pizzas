
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Phone, MapPin, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url?: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

const Index = () => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStoreHours();
    fetchMenuData();
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkStoreHours();
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const checkStoreHours = () => {
    const now = new Date();
    const hour = now.getHours();
    const isOpen = hour >= 18 || hour < 1; // 18:00 às 00:59
    setIsStoreOpen(isOpen);
  };

  const fetchMenuData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (productsError) throw productsError;

      const productsByCategory: Record<string, Product[]> = {};
      productsData?.forEach(product => {
        if (!productsByCategory[product.category_id]) {
          productsByCategory[product.category_id] = [];
        }
        productsByCategory[product.category_id].push(product);
      });

      setCategories(categoriesData || []);
      setProducts(productsByCategory);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar o cardápio');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isStoreOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <div className="bg-red-600 text-white rounded-full w-32 h-32 flex items-center justify-center text-6xl font-bold mx-auto mb-8 shadow-2xl">
            T
          </div>
          <h1 className="text-5xl font-bold mb-4">TALOLA PIZZA</h1>
          <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-8 border border-red-600/30">
            <Clock className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-red-400 mb-4">LOJA FECHADA</h2>
            <p className="text-xl mb-6">Estamos fechados no momento.</p>
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg inline-block">
              <p className="text-lg font-bold">HORÁRIO DE FUNCIONAMENTO</p>
              <p className="text-2xl font-bold">18:00 ÀS 00:00</p>
              <p className="text-sm">Todos os dias</p>
            </div>
            <div className="mt-8 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                <span>(21) 97540-6476</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Irapiranga 11 Loja - Rocha Miranda</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg">
                T
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">TALOLA PIZZA</h1>
                <p className="text-orange-300 text-sm">A melhor pizza da região!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-white text-center hidden md:block">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-bold">ABERTO</span>
                </div>
                <p className="text-sm">18:00 - 00:00</p>
              </div>
              
              <Link 
                to="/menu" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                VER CARDÁPIO
              </Link>
              
              <Link 
                to="/staff-login" 
                className="text-orange-300 hover:text-white transition-colors text-sm"
              >
                Staff
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/10">
            <h2 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              PIZZA ARTESANAL
            </h2>
            <p className="text-2xl mb-8 text-orange-100">
              Feita com ingredientes frescos e muito amor
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
                <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">QUALIDADE PREMIUM</h3>
                <p className="text-orange-100">Ingredientes selecionados e massa fresca</p>
              </div>
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
                <Clock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">ENTREGA RÁPIDA</h3>
                <p className="text-orange-100">Até 40 minutos na sua casa</p>
              </div>
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
                <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">ATENDIMENTO</h3>
                <p className="text-orange-100">(21) 97540-6476</p>
              </div>
            </div>

            <Link 
              to="/menu"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl inline-block"
            >
              FAZER PEDIDO AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            NOSSO CARDÁPIO
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((category) => (
              <Card key={category.id} className="bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{category.name}</h3>
                  <p className="text-orange-200 mb-6">{category.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {products[category.id]?.slice(0, 2).map((product) => (
                      <div key={product.id} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-sm">{product.name}</span>
                          <Badge className="bg-red-600 text-white">
                            {formatPrice(product.base_price)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/menu">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Ver Todos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">CONTATO</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-red-400" />
                  <span className="text-xl">(21) 97540-6476</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-red-400" />
                  <span>Irapiranga 11 Loja - Rocha Miranda</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-red-400" />
                  <span>Todos os dias das 18:00 às 00:00</span>
                </div>
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">SOBRE NÓS</h2>
              <p className="text-orange-100 leading-relaxed">
                A Talola Pizza é uma pizzaria artesanal que se dedica a oferecer 
                as melhores pizzas da região. Com ingredientes frescos e receitas 
                exclusivas, garantimos uma experiência única para nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
              T
            </div>
            <span className="text-2xl font-bold">TALOLA PIZZA</span>
          </div>
          <p className="text-orange-300">
            &copy; 2024 Talola Pizza. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
