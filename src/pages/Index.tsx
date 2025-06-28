import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Phone, MapPin, Star, ShoppingCart, Menu, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import StoreStatusBanner from '@/components/StoreStatusBanner';

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
  const { checkStoreInteraction, isOpen, getFormattedHours } = useStoreStatus();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

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

  const handleMenuClick = () => {
    if (!checkStoreInteraction()) {
      return;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      <StoreStatusBanner />

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg">
                T
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white">TALOLA PIZZA</h1>
                <p className="text-orange-300 text-xs sm:text-sm">A melhor pizza da região!</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className={`text-white text-center ${!isOpen ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className={`font-bold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {isOpen ? 'ABERTO' : 'FECHADO'}
                  </span>
                </div>
                <p className="text-sm">{getFormattedHours()}</p>
              </div>
              
              <Link 
                to="/menu" 
                onClick={handleMenuClick}
                className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 ${!isOpen ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="h-5 w-5" />
                VER CARDÁPIO
              </Link>
              
              <Link 
                to="/funcionario-login" 
                className="text-orange-300 hover:text-white transition-colors text-sm"
              >
                Funcionário
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/20"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
              <div className="flex flex-col space-y-4">
                <div className={`text-white text-center ${!isOpen ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className={`font-bold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                      {isOpen ? 'ABERTO' : 'FECHADO'}
                    </span>
                  </div>
                  <p className="text-sm">{getFormattedHours()}</p>
                </div>
                
                <Link 
                  to="/menu" 
                  onClick={handleMenuClick}
                  className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${!isOpen ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  VER CARDÁPIO
                </Link>
                
                <Link 
                  to="/funcionario-login" 
                  className="text-orange-300 hover:text-white transition-colors text-center"
                >
                  Área do Funcionário
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/10">
            <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              PIZZA ARTESANAL
            </h2>
            <p className="text-lg sm:text-2xl mb-8 text-orange-100">
              Feita com ingredientes frescos e muito amor
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-red-600/30">
                <Star className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">QUALIDADE PREMIUM</h3>
                <p className="text-sm sm:text-base text-orange-100">Ingredientes selecionados e massa fresca</p>
              </div>
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-red-600/30">
                <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">ENTREGA RÁPIDA</h3>
                <p className="text-sm sm:text-base text-orange-100">Até 40 minutos na sua casa</p>
              </div>
              <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-red-600/30">
                <Phone className="h-8 w-8 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">ATENDIMENTO</h3>
                <p className="text-sm sm:text-base text-orange-100">(21) 97540-6476</p>
              </div>
            </div>

            <Link 
              to="/menu"
              onClick={handleMenuClick}
              className={`bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl inline-block ${!isOpen ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              FAZER PEDIDO AGORA
            </Link>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
            NOSSO CARDÁPIO
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {categories.map((category) => (
              <Card key={category.id} className={`bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/70 transition-all duration-300 transform hover:scale-105 ${!isOpen ? 'opacity-75' : ''}`}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{category.name}</h3>
                  <p className="text-orange-200 mb-4 sm:mb-6 text-sm sm:text-base">{category.description}</p>
                  
                  <div className="space-y-3 mb-4 sm:mb-6">
                    {products[category.id]?.slice(0, 2).map((product) => (
                      <div key={product.id} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-xs sm:text-sm">{product.name}</span>
                          <Badge className="bg-red-600 text-white text-xs">
                            {formatPrice(product.base_price)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/menu" onClick={handleMenuClick}>
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
      <section className="py-8 sm:py-16 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">CONTATO</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  <span className="text-lg sm:text-xl">(21) 97540-6476</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  <span className="text-sm sm:text-base">Irapiranga 11 Loja - Rocha Miranda</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                  <span className="text-sm sm:text-base">Funcionamos das {getFormattedHours()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">SOBRE NÓS</h2>
              <p className="text-orange-100 leading-relaxed text-sm sm:text-base">
                A Talola Pizza é uma pizzaria artesanal que se dedica a oferecer 
                as melhores pizzas da região. Com ingredientes frescos e receitas 
                exclusivas, garantimos uma experiência única para nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold">
              T
            </div>
            <span className="text-xl sm:text-2xl font-bold">TALOLA PIZZA</span>
          </div>
          <p className="text-orange-300 text-sm sm:text-base">
            &copy; 2024 Talola Pizza. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
