
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Star, Phone, MapPin, Truck, Zap, Pizza, ChefHat, Settings } from 'lucide-react';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import StoreStatusBanner from '@/components/StoreStatusBanner';

const Index = () => {
  const navigate = useNavigate();
  const { isOpen, getFormattedHours } = useStoreStatus();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel de imagens de pizzas reais
  const pizzaImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % pizzaImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      <StoreStatusBanner />
      
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">TALOLA PIZZA</h1>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                    {isOpen ? `Aberto até ${getFormattedHours().split(' - ')[1]}` : 'Fechado'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={() => navigate('/funcionario-login')}
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hidden sm:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                Funcionário
              </Button>
              <Button
                onClick={() => navigate('/funcionario-login')}
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:hidden p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate('/menu')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ver Cardápio</span>
                <span className="sm:hidden">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                As Melhores
                <span className="block text-yellow-400">Pizzas da Cidade</span>
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Sabores autênticos, ingredientes frescos e a tradição italiana em cada fatia. 
                Experimente nossas receitas especiais preparadas com amor.
              </p>
              
              {/* Delivery Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                  <h3 className="text-lg sm:text-2xl font-bold text-white">Taxa de entrega a partir de R$ 5</h3>
                </div>
                <p className="text-white/80 text-base sm:text-lg">
                  Para toda a região central. Entrega em até 30 minutos!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/menu')}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg"
                >
                  <Pizza className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Peça Agora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white font-bold py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base sm:text-lg"
                >
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Pizza Carousel */}
            <div className="relative">
              <div className="relative h-64 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={pizzaImages[currentImageIndex]}
                  alt="Pizza deliciosa"
                  className="w-full h-full object-cover transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {pizzaImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Por que nos escolher?</h3>
            <p className="text-lg sm:text-xl text-white/80">Qualidade, sabor e tradição em cada pedido</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-red-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Receitas Tradicionais</h4>
                <p className="text-white/80 text-sm sm:text-base">Seguimos receitas familiares passadas de geração em geração</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Entrega Rápida</h4>
                <p className="text-white/80 text-sm sm:text-base">Suas pizzas chegam quentinhas em até 30 minutos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 sm:col-span-2 md:col-span-1">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="bg-yellow-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Qualidade Premium</h4>
                <p className="text-white/80 text-sm sm:text-base">Ingredientes frescos e selecionados todos os dias</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-white/80 text-sm sm:text-base">Pizzas Vendidas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-green-400 mb-2">4.8</div>
              <div className="text-white/80 flex items-center justify-center gap-1 text-sm sm:text-base">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                Avaliação
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-blue-400 mb-2">30min</div>
              <div className="text-white/80 text-sm sm:text-base">Tempo Médio</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-red-400 mb-2">100%</div>
              <div className="text-white/80 text-sm sm:text-base">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contato</h3>
            <p className="text-lg sm:text-xl text-white/80">Estamos aqui para te atender</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white">WhatsApp</h4>
                    <p className="text-white/80 text-sm sm:text-base">(21) 97540-6476</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Chamar no WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white">Endereço</h4>
                    <p className="text-white/80 text-sm sm:text-base">Centro - Rio de Janeiro, RJ</p>
                  </div>
                </div>
                <div className="text-white/80">
                  <p className="mb-2 text-sm sm:text-base">
                    <strong>Horário:</strong> {getFormattedHours()}
                  </p>
                  <Badge className={`${isOpen ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isOpen ? '🟢 Aberto' : '🔴 Fechado'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-sm py-6 sm:py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
              T
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">TALOLA PIZZA</h3>
          </div>
          <p className="text-white/60 mb-4 text-sm sm:text-base">
            © 2024 Talola Pizza. A melhor pizza da cidade.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
              className="text-white/80 hover:text-white"
            >
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/funcionario-login')}
              className="text-white/80 hover:text-white"
            >
              Funcionário
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
