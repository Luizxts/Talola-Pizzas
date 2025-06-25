
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Star, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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
            <Card className="border-2 border-red-200 hover:border-red-400 transition-colors">
              <CardHeader>
                <Badge className="bg-red-600 text-white w-fit">PROMOÇÃO</Badge>
                <CardTitle className="text-red-600">Pizza Doce Gigante</CardTitle>
                <CardDescription>60cm de pura delícia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">R$ 80,00</div>
                <p className="text-gray-600 text-sm">Perfeita para compartilhar!</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <Badge className="bg-green-600 text-white w-fit">COMBO</Badge>
                <CardTitle className="text-green-600">Combo Burger</CardTitle>
                <CardDescription>Burger + Batata + Refrigerante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">R$ 25,00</div>
                <p className="text-gray-600 text-sm">Economia garantida!</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <Badge className="bg-purple-600 text-white w-fit">ESPECIAL</Badge>
                <CardTitle className="text-purple-600">Açaí + 3 Acompanhamentos</CardTitle>
                <CardDescription>500ml de açaí cremoso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">R$ 15,00</div>
                <p className="text-gray-600 text-sm">Delícia refrescante!</p>
              </CardContent>
            </Card>
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

      {/* Avaliações */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As pizzas doces são incríveis! A de Prestígio é minha favorita. 
                  Entrega rápida e sempre quentinha."
                </p>
                <p className="font-semibold">Maria Silva</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Os burgers são muito saborosos! O X-Tudo é perfeito. 
                  Preço justo e qualidade excelente."
                </p>
                <p className="font-semibold">João Santos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Atendimento nota 10! Sempre muito educados e o açaí é delicioso. 
                  Recomendo muito!"
                </p>
                <p className="font-semibold">Ana Costa</p>
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
