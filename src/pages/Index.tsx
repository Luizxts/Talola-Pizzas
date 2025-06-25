
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleAddSpecialToCart = (special: any) => {
    // Get existing cart from localStorage or create new one
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add the special offer to cart
    const cartItem = {
      id: special.id,
      name: special.name,
      basePrice: special.price,
      quantity: 1,
      totalPrice: special.price,
      selectedOptions: {},
      isSpecialOffer: true
    };

    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => 
      item.id === special.id && item.isSpecialOffer
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
      existingCart[existingItemIndex].totalPrice += special.price;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Navigate to menu with cart updated
    navigate('/menu');
  };

  const specialOffers = [
    {
      id: 'special-pizza-gigante',
      name: 'Pizza Doce Gigante',
      description: '60cm de pura delícia',
      price: 80.00,
      badge: 'PROMOÇÃO',
      badgeColor: 'bg-red-600'
    },
    {
      id: 'special-combo-burger',
      name: 'Combo Burger',
      description: 'Burger + Batata + Refrigerante',
      price: 25.00,
      badge: 'COMBO',
      badgeColor: 'bg-green-600'
    },
    {
      id: 'special-acai-combo',
      name: 'Açaí + 3 Acompanhamentos',
      description: '500ml de açaí cremoso',
      price: 15.00,
      badge: 'ESPECIAL',
      badgeColor: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-600">TALOLA</h1>
                <p className="text-sm text-gray-600">Pizzas e Burgers</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/menu')}
                className="bg-red-600 hover:bg-red-700"
              >
                Ver Cardápio
              </Button>
              <Button
                onClick={() => navigate('/staff-login')}
                variant="outline"
                size="sm"
              >
                Funcionários
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-6 bg-red-100 text-red-800 text-sm px-4 py-2">
            🔥 Delivery Disponível
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sabores que
            <span className="text-red-600 block">Conquistam</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pizzas doces irresistíveis, burgers artesanais e petiscos deliciosos. 
            Feito com carinho para você!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/menu')}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3"
            >
              Fazer Pedido
            </Button>
            <Button
              onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Ofertas Especiais */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ofertas Especiais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specialOffers.map((special) => (
              <Card key={special.id} className="border-2 border-red-200 hover:border-red-400 transition-colors">
                <CardHeader>
                  <Badge className={`${special.badgeColor} text-white w-fit`}>
                    {special.badge}
                  </Badge>
                  <CardTitle className="text-red-600">{special.name}</CardTitle>
                  <CardDescription>{special.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    R$ {special.price.toFixed(2).replace('.', ',')}
                  </div>
                  <Button 
                    onClick={() => handleAddSpecialToCart(special)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Informações */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Horário de Funcionamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Terça a Quinta:</strong> 18:00 às 00:00</p>
                  <p><strong>Sexta e Sábado:</strong> 18:00 às 01:00</p>
                  <p><strong>Domingo:</strong> 18:00 às 00:00</p>
                  <p className="text-red-600 font-medium">Segunda: Fechado</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Rio de Janeiro - RJ<br />
                  Entregamos em toda a região
                </p>
                <Badge className="bg-green-100 text-green-800">
                  Taxa de entrega: R$ 5,00
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
                  className="bg-green-600 hover:bg-green-700 w-full mb-4"
                >
                  WhatsApp: (21) 97540-6476
                </Button>
                <p className="text-sm text-gray-600">
                  Estamos aqui para lhe servir bem!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-red-400 mb-2">TALOLA</h3>
            <p className="text-gray-400">Pizzas e Burgers</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">
              Aceitamos: <span className="text-white">PIX • Cartão • Dinheiro</span>
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 TALOLA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
