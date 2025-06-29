
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, MapPin, Phone, ChefHat, Truck, ShoppingCart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import StoreStatusBanner from '@/components/StoreStatusBanner';

const Index = () => {
  const navigate = useNavigate();
  const { isOpen } = useStoreStatus();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleOrderClick = () => {
    if (!isOpen) {
      toast.error('Loja fechada no momento. Volte durante o horário de funcionamento!');
      return;
    }
    navigate('/menu');
  };

  const features = [
    {
      icon: ChefHat,
      title: 'Receitas Tradicionais',
      description: 'Pizzas preparadas com ingredientes frescos e receitas especiais',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Delivery em até 30 minutos na sua região',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Star,
      title: 'Qualidade Premium',
      description: 'Ingredientes selecionados e massa artesanal',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const specialOffers = [
    {
      title: 'Pizza Margherita Especial',
      description: 'Molho especial, mussarela de búfala, tomate cherry e manjericão fresco',
      price: 'R$ 45,90',
      originalPrice: 'R$ 52,90',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop'
    },
    {
      title: 'Combo Família',
      description: '2 pizzas grandes + refrigerante 2L + sobremesa',
      price: 'R$ 89,90',
      originalPrice: 'R$ 110,90',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StoreStatusBanner />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold shadow-2xl">
                  T
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              TONY'S PIZZA
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light">
              Sabores Autênticos, Momentos Especiais
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className="text-white font-medium">{formatTime(currentTime)}</span>
              </div>
              <Badge className={`px-6 py-3 text-lg font-bold ${isOpen ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white shadow-lg`}>
                {isOpen ? '🟢 Aberto' : '🔴 Fechado'}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={handleOrderClick}
                disabled={!isOpen}
                className={`px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-2xl hover:shadow-orange-500/25 hover:scale-105' 
                    : 'bg-slate-700 cursor-not-allowed text-slate-400'
                }`}
                size="lg"
              >
                {isOpen ? (
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6" />
                    FAZER PEDIDO AGORA
                  </div>
                ) : (
                  'LOJA FECHADA'
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/menu')}
                variant="outline"
                className="px-12 py-6 text-xl font-bold rounded-2xl border-2 border-orange-400/50 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 backdrop-blur-sm"
                size="lg"
              >
                VER CARDÁPIO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Ofertas Especiais
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Promoções imperdíveis para você saborear o melhor da nossa cozinha
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {specialOffers.map((offer, index) => (
            <Card key={index} className="group overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 backdrop-blur-sm animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    OFERTA ESPECIAL
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-white font-bold group-hover:text-orange-300 transition-colors">
                  {offer.title}
                </CardTitle>
                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  {offer.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-400">{offer.price}</span>
                    <span className="text-lg text-slate-400 line-through">{offer.originalPrice}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleOrderClick}
                  disabled={!isOpen}
                  className={`w-full py-3 text-lg font-bold rounded-xl transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:scale-[1.02]' 
                      : 'bg-slate-700 cursor-not-allowed text-slate-400'
                  }`}
                >
                  {isOpen ? 'PEDIR AGORA' : 'LOJA FECHADA'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Por Que Escolher Tony's?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Qualidade, sabor e tradição em cada fatia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group text-center bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                  <CardHeader className="pb-6">
                    <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white font-bold group-hover:text-orange-300 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Contato & Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Endereço</h3>
                      <p className="text-slate-300">Rua das Pizzas, 123 - Centro</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Telefone</h3>
                      <p className="text-slate-300">(21) 97540-6476</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Horário</h3>
                      <p className="text-slate-300">Seg-Dom: 18:00 - 00:00</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-xl border border-orange-500/20">
                    <h3 className="font-bold text-white text-xl mb-4">🍕 Delivery Grátis</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Para pedidos acima de R$ 50,00 na região central. 
                      Entrega em até 30 minutos!
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
                    <h3 className="font-bold text-white text-xl mb-4">💳 Formas de Pagamento</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-green-600 text-white">PIX</Badge>
                      <Badge className="bg-blue-600 text-white">Cartão</Badge>
                      <Badge className="bg-yellow-600 text-white">Dinheiro</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
