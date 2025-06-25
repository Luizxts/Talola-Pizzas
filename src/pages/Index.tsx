
import React from 'react';
import { Phone, Clock, MapPin, Star, Pizza, Utensils, Coffee, IceCream } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const openingHours = [
    { day: 'Terça a Quinta', hours: '18:00 - 00:00' },
    { day: 'Sexta e Sábado', hours: '18:00 - 01:00' },
    { day: 'Domingo', hours: '18:00 - 00:00' },
    { day: 'Segunda', hours: 'Fechado' }
  ];

  const specialOffers = [
    {
      title: '2 Pizzas Gigante + Pizza Média',
      description: '+ Refrigerante 2L',
      price: 'R$ 110,00',
      highlight: true
    },
    {
      title: '2 Pizzas Média',
      description: '+ Refrigerante 2L',
      price: 'R$ 55,00'
    },
    {
      title: '2 Pizzas Família',
      description: '+ Refrigerante 2L',
      price: 'R$ 65,00'
    }
  ];

  const categories = [
    { name: 'Pizzas Doces', icon: Pizza, description: 'Sabores únicos e irresistíveis' },
    { name: 'Burgers', icon: Utensils, description: 'Hambúrgueres artesanais' },
    { name: 'Petiscos', icon: Coffee, description: 'Para compartilhar' },
    { name: 'Açaí', icon: IceCream, description: 'Cremoso e delicioso' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-orange-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-4 drop-shadow-lg">
              TALOLA
            </h1>
            <p className="text-2xl md:text-3xl font-light tracking-wide opacity-90">
              PIZZAS E BURGERS
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Badge className="bg-yellow-500 text-black font-semibold text-lg px-4 py-2">
                DELIVERY DISPONÍVEL
              </Badge>
              <Badge className="bg-green-600 text-white font-semibold text-lg px-4 py-2">
                TEMOS AÇAÍ
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Contact & Hours Section */}
      <section className="py-12 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact */}
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Phone className="mx-auto h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl text-gray-800">Contato</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-600 mb-2">
                  +55 21 97540-6476
                </p>
                <p className="text-gray-600">WhatsApp</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                  Fazer Pedido
                </Button>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Clock className="mx-auto h-12 w-12 text-orange-600 mb-4" />
                <CardTitle className="text-xl text-gray-800">Funcionamento</CardTitle>
              </CardHeader>
              <CardContent>
                {openingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{schedule.day}</span>
                    <span className={`font-semibold ${schedule.hours === 'Fechado' ? 'text-red-500' : 'text-green-600'}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl text-gray-800">Localização</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700 mb-2">Irapiranga 11 Loja</p>
                <p className="text-gray-700 mb-4">Rocha Miranda</p>
                <p className="text-sm text-gray-500">Taxa de entrega a partir de</p>
                <p className="text-2xl font-bold text-red-600">R$ 5,00</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-red-900 to-orange-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Ofertas Especiais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specialOffers.map((offer, index) => (
              <Card key={index} className={`${offer.highlight ? 'ring-4 ring-yellow-400 transform scale-105' : ''} bg-white text-gray-800 hover:shadow-2xl transition-all`}>
                <CardHeader className="text-center">
                  {offer.highlight && (
                    <Badge className="bg-yellow-500 text-black font-bold text-sm mb-4 mx-auto">
                      MAIS PEDIDA!
                    </Badge>
                  )}
                  <CardTitle className="text-xl">{offer.title}</CardTitle>
                  <CardDescription className="text-lg">{offer.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-red-600 mb-4">{offer.price}</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                    Pedir Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Nosso Cardápio</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="border-2 border-orange-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                  <CardHeader className="text-center">
                    <Icon className="mx-auto h-16 w-16 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-xl text-gray-800">{category.name}</CardTitle>
                    <CardDescription className="text-gray-600">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                      Ver Cardápio
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Formas de Pagamento</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            <Badge className="bg-blue-600 text-white text-lg px-6 py-3">PIX</Badge>
            <Badge className="bg-purple-600 text-white text-lg px-6 py-3">CARTÃO</Badge>
            <Badge className="bg-green-600 text-white text-lg px-6 py-3">DINHEIRO</Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">TALOLA</h3>
          <p className="text-gray-400 mb-4">Pizzas e Burgers</p>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-gray-400">Estamos aqui para lhe servir bem!</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 TALOLA - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
