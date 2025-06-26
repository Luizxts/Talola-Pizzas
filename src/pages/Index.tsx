
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu as MenuIcon } from 'lucide-react';
import OrderCart from '@/components/OrderCart';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/components/ui/use-toast"
import Logo from '@/components/Logo';

const Index = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast()

  useEffect(() => {
    // Load cart items from local storage on component mount
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever cartItems changes
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: any) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      updatedCartItems[existingItemIndex].totalPrice = updatedCartItems[existingItemIndex].basePrice * updatedCartItems[existingItemIndex].quantity;
      setCartItems(updatedCartItems);
    } else {
      const newItem = { ...item, quantity: 1, totalPrice: item.basePrice };
      setCartItems([...cartItems, newItem]);
    }

    toast({
      title: "Item adicionado ao carrinho!",
      description: "Confira seu pedido no carrinho para finalizar.",
    })
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[itemIndex].quantity = newQuantity;
    updatedCartItems[itemIndex].totalPrice = updatedCartItems[itemIndex].basePrice * newQuantity;
    setCartItems(updatedCartItems);
  };

  const removeItem = (itemIndex: number) => {
    const updatedCartItems = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Produtos baseados nas imagens da Talola
  const combos = [
    {
      id: 'combo1',
      name: '2 Pizzas Gigante + Pizza Média + Refrigerante 2L',
      description: 'Temos açaí! Oferta especial com 2 pizzas gigante + 1 pizza média + refrigerante 2L',
      basePrice: 110.00,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0994a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      isSpecialOffer: true,
      category: 'combos'
    },
    {
      id: 'combo2',
      name: '2 Pizzas Média + Refrigerante 2L',
      description: 'Combo com 2 pizzas média + refrigerante 2L',
      basePrice: 55.00,
      image: 'https://images.unsplash.com/photo-1604382355076-e3506ca959dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'combos'
    },
    {
      id: 'combo3',
      name: '2 Pizzas Família + Refrigerante 2L',
      description: 'Combo com 2 pizzas família + refrigerante 2L',
      basePrice: 65.00,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'combos'
    }
  ];

  const burgers = [
    {
      id: 'burger1',
      name: 'X-Burguer',
      description: 'Pão, carne, queijo, molho especial e salada',
      basePrice: 7.00,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'burgers'
    },
    {
      id: 'burger2',
      name: 'X-Bacon',
      description: 'Pão, carne, queijo, bacon, molho especial e salada',
      basePrice: 10.00,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'burgers'
    },
    {
      id: 'burger3',
      name: 'X-Tudo',
      description: 'Pão, carne, queijo, ovo, bacon, calabresa, molho especial e salada',
      basePrice: 12.00,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'burgers'
    }
  ];

  const pizzasDoces = [
    {
      id: 'pizza-doce1',
      name: 'Pizza de Banana',
      description: 'Creme de leite, mussarela, banana, canela e açúcar',
      basePrice: 30.00,
      image: 'https://images.unsplash.com/photo-1630749458463-01d3c9a587ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'pizzas-doces'
    },
    {
      id: 'pizza-doce2',
      name: 'Pizza de Chocolate',
      description: 'Creme de leite, mussarela, banana, chocolate',
      basePrice: 30.00,
      image: 'https://images.unsplash.com/photo-1630749458463-01d3c9a587ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'pizzas-doces'
    },
    {
      id: 'pizza-doce3',
      name: 'Pizza Romeu e Julieta',
      description: 'Creme de leite, mussarela, goiabada em calda e catupiry',
      basePrice: 30.00,
      image: 'https://images.unsplash.com/photo-1630749458463-01d3c9a587ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'pizzas-doces'
    }
  ];

  const acai = [
    {
      id: 'acai1',
      name: 'Açaí 250ml',
      description: 'Açaí cremoso com acompanhamentos à sua escolha',
      basePrice: 6.00,
      image: 'https://images.unsplash.com/photo-1628014150673-98824b3a2e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'acai'
    },
    {
      id: 'acai2',
      name: 'Açaí 500ml',
      description: 'Açaí cremoso com acompanhamentos à sua escolha',
      basePrice: 9.00,
      image: 'https://images.unsplash.com/photo-1628014150673-98824b3a2e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'acai'
    },
    {
      id: 'acai3',
      name: 'Açaí 770ml',
      description: 'Açaí cremoso com frutas, chantilly, bis, barra de chocolate e nutella',
      basePrice: 12.00,
      image: 'https://images.unsplash.com/photo-1628014150673-98824b3a2e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      category: 'acai'
    }
  ];

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600">
      {/* Header */}
      <header className="bg-black/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl shadow-lg">
                  T
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-yellow-400">TALOLA</h1>
                  <p className="text-yellow-300 text-sm">PIZZAS E BURGERS</p>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/menu" 
                className="text-yellow-300 hover:text-yellow-400 transition-colors font-medium"
              >
                Cardápio
              </Link>
              <a href="#sobre" className="text-yellow-300 hover:text-yellow-400 transition-colors font-medium">
                Sobre
              </a>
              <a href="#contato" className="text-yellow-300 hover:text-yellow-400 transition-colors font-medium">
                Contato
              </a>
            </nav>
            {/* Cart Icon */}
            <div className="relative">
              <Link to="/menu" className="flex items-center space-x-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-bold">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cardápio</span>
                {cartItems.length > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    {cartItems.length}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/80 rounded-lg p-8 shadow-2xl">
            <h2 className="text-5xl font-extrabold text-yellow-400 mb-4">
              FUNCIONAMOS
            </h2>
            <p className="text-2xl text-white mb-2">TODOS OS DIAS DAS</p>
            <p className="text-4xl font-bold text-yellow-400 mb-8">18:00 ÀS 00:00</p>
            <div className="bg-yellow-400 text-black px-8 py-4 rounded-lg inline-block">
              <p className="text-lg font-bold">Taxa de entrega a partir de R$ 3,00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas Especiais */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            OFERTAS ESPECIAIS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.filter(combo => combo.isSpecialOffer).map((combo) => (
              <Card key={combo.id} className="border-4 border-yellow-400 bg-black/90 text-white">
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold">
                      OFERTA ESPECIAL
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    {combo.name}
                  </h3>
                  <p className="text-white mb-3">{combo.description}</p>
                  <p className="text-yellow-400 font-bold text-2xl mb-4">
                    {formatPrice(combo.basePrice)}
                  </p>
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
                    onClick={() => {
                      const itemToAdd = {
                        id: combo.id,
                        name: combo.name,
                        basePrice: combo.basePrice,
                        selectedOptions: {},
                        isSpecialOffer: true
                      };
                      
                      addToCart(itemToAdd);
                    }}
                  >
                    ADICIONAR AO CARRINHO
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Burgers Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            BURGERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {burgers.map((burger) => (
              <Card key={burger.id} className="bg-black/90 text-white border-2 border-yellow-400">
                <CardContent className="p-4">
                  <img
                    src={burger.image}
                    alt={burger.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    {burger.name}
                  </h3>
                  <p className="text-white mb-3">{burger.description}</p>
                  <p className="text-yellow-400 font-bold text-xl mb-4">
                    {formatPrice(burger.basePrice)}
                  </p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Link to="/menu">
                      VER OPÇÕES E PEDIR
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pizzas Doces Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            PIZZAS DOCES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzasDoces.map((pizza) => (
              <Card key={pizza.id} className="bg-black/90 text-white border-2 border-yellow-400">
                <CardContent className="p-4">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    {pizza.name}
                  </h3>
                  <p className="text-white mb-3">{pizza.description}</p>
                  <p className="text-yellow-400 font-bold text-xl mb-4">
                    A partir de {formatPrice(pizza.basePrice)}
                  </p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Link to="/menu">
                      VER OPÇÕES E PEDIR
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Açaí Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            AÇAÍ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acai.map((item) => (
              <Card key={item.id} className="bg-black/90 text-white border-2 border-yellow-400">
                <CardContent className="p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white mb-3">{item.description}</p>
                  <p className="text-yellow-400 font-bold text-xl mb-4">
                    {formatPrice(item.basePrice)}
                  </p>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Link to="/menu">
                      VER OPÇÕES E PEDIR
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobre" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/90 rounded-lg p-8">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
              Sobre a Talola
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&q=80"
                  alt="Nossa História"
                  className="w-full h-auto rounded-md shadow-md"
                />
              </div>
              <div>
                <p className="text-white leading-7 mb-4">
                  A Talola Pizzas e Burgers é referência em qualidade e sabor na região de Irapiranga 11. 
                  Oferecemos pizzas artesanais, burgers suculentos e o melhor açaí da cidade!
                </p>
                <p className="text-white leading-7 mb-4">
                  Funcionamos todos os dias das 18:00 às 00:00, sempre prontos para atender você 
                  com o melhor da nossa culinária.
                </p>
                <p className="text-yellow-400 font-bold">
                  Localizado em Irapiranga 11, Loja - Rocha Miranda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/90 rounded-lg p-8">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
              Entre em Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                  Informações de Contato
                </h3>
                <p className="text-white mb-4 text-lg">
                  <strong className="text-yellow-400">Endereço:</strong> Irapiranga 11 Loja - Rocha Miranda
                </p>
                <p className="text-white mb-4 text-lg">
                  <strong className="text-yellow-400">WhatsApp:</strong> (21) 97540-6476
                </p>
                <p className="text-white mb-4 text-lg">
                  <strong className="text-yellow-400">Horário:</strong> Todos os dias das 18:00 às 00:00
                </p>
                <div className="bg-yellow-400 text-black p-4 rounded-lg mt-6">
                  <p className="font-bold text-lg">DELIVERY</p>
                  <p className="text-2xl font-bold">(21) 97540-6476</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                  Envie uma Mensagem
                </h3>
                <form className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Seu Nome"
                      className="w-full px-4 py-3 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Seu Telefone"
                      className="w-full px-4 py-3 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Sua Mensagem"
                      className="w-full px-4 py-3 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-black"
                    />
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3">
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/95 py-6 text-center">
        <p className="text-yellow-400 font-bold">
          &copy; 2023 Talola Pizzas e Burgers. Todos os direitos reservados.
        </p>
        <p className="text-white mt-2">
          Irapiranga 11 Loja - Rocha Miranda | WhatsApp: (21) 97540-6476
        </p>
      </footer>

      {/* Mobile Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden fixed bottom-4 right-4 z-50 bg-yellow-500 text-black border-yellow-400">
            <MenuIcon className="mr-2 h-4 w-4" />
            Carrinho
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Seu Carrinho</SheetTitle>
            <SheetDescription>
              Confira os itens no seu carrinho antes de finalizar o pedido.
            </SheetDescription>
          </SheetHeader>
          <OrderCart
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
