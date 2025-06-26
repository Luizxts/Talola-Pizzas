
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
      title: "Pizza adicionada ao carrinho!",
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

  const pizzas = [
    {
      id: '1',
      name: 'Pizza de Calabresa',
      description: 'Deliciosa pizza de calabresa com queijo e molho de tomate.',
      basePrice: 39.90,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0994a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      options: [
        {
          name: 'Borda',
          choices: [
            { id: 'borda-catupiry', name: 'Catupiry', price: 7.90 },
            { id: 'borda-cheddar', name: 'Cheddar', price: 9.90 },
            { id: 'sem-borda', name: 'Sem Borda', price: 0 }
          ]
        },
        {
          name: 'Tamanho',
          choices: [
            { id: 'tamanho-media', name: 'Média', price: 0 },
            { id: 'tamanho-grande', name: 'Grande', price: 10.00 }
          ]
        },
        {
          name: 'Adicionais',
          choices: [
            { id: 'adicional-pepperoni', name: 'Pepperoni', price: 12.00 },
            { id: 'adicional-bacon', name: 'Bacon', price: 9.00 },
            { id: 'sem-adicional', name: 'Sem Adicional', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Pizza de Frango com Catupiry',
      description: 'Pizza saborosa com frango desfiado e кремовый catupiry.',
      basePrice: 45.90,
      image: 'https://images.unsplash.com/photo-1604382355076-e3506ca959dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      options: [
        {
          name: 'Borda',
          choices: [
            { id: 'borda-catupiry', name: 'Catupiry', price: 7.90 },
            { id: 'borda-cheddar', name: 'Cheddar', price: 9.90 },
            { id: 'sem-borda', name: 'Sem Borda', price: 0 }
          ]
        },
        {
          name: 'Tamanho',
          choices: [
            { id: 'tamanho-media', name: 'Média', price: 0 },
            { id: 'tamanho-grande', name: 'Grande', price: 10.00 }
          ]
        },
        {
          name: 'Adicionais',
          choices: [
            { id: 'adicional-milho', name: 'Milho', price: 5.00 },
            { id: 'adicional-azeitona', name: 'Azeitona', price: 6.00 },
            { id: 'sem-adicional', name: 'Sem Adicional', price: 0 }
          ]
        }
      ],
      isSpecialOffer: true
    },
    {
      id: '3',
      name: 'Pizza Portuguesa',
      description: 'A clássica pizza portuguesa com presunto, queijo, ovos e azeitonas.',
      basePrice: 42.50,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      options: [
        {
          name: 'Borda',
          choices: [
            { id: 'borda-catupiry', name: 'Catupiry', price: 7.90 },
            { id: 'borda-cheddar', name: 'Cheddar', price: 9.90 },
            { id: 'sem-borda', name: 'Sem Borda', price: 0 }
          ]
        },
        {
          name: 'Tamanho',
          choices: [
            { id: 'tamanho-media', name: 'Média', price: 0 },
            { id: 'tamanho-grande', name: 'Grande', price: 10.00 }
          ]
        },
        {
          name: 'Adicionais',
          choices: [
            { id: 'adicional-cebola', name: 'Cebola', price: 4.00 },
            { id: 'adicional-pimentao', name: 'Pimentão', price: 5.00 },
            { id: 'sem-adicional', name: 'Sem Adicional', price: 0 }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Pizza de Brigadeiro',
      description: 'Doce pizza de brigadeiro para os amantes de chocolate.',
      basePrice: 48.00,
      image: 'https://images.unsplash.com/photo-1630749458463-01d3c9a587ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80',
      options: [
        {
          name: 'Borda',
          choices: [
            { id: 'borda-chocolate', name: 'Chocolate', price: 8.90 },
            { id: 'borda-doce-de-leite', name: 'Doce de Leite', price: 9.90 },
            { id: 'sem-borda', name: 'Sem Borda', price: 0 }
          ]
        },
        {
          name: 'Tamanho',
          choices: [
            { id: 'tamanho-media', name: 'Média', price: 0 },
            { id: 'tamanho-grande', name: 'Grande', price: 10.00 }
          ]
        },
        {
          name: 'Adicionais',
          choices: [
            { id: 'adicional-granulado', name: 'Granulado', price: 6.00 },
            { id: 'adicional-morango', name: 'Morango', price: 7.00 },
            { id: 'sem-adicional', name: 'Sem Adicional', price: 0 }
          ]
        }
      ]
    },
  ];

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/menu" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Cardápio
              </Link>
              <a href="#sobre" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Sobre
              </a>
              <a href="#contato" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Contato
              </a>
            </nav>
            {/* Cart Icon */}
            <div className="relative">
              <Link to="/menu" className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
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
      <section className="bg-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-green-800 mb-4">
            Talola Pizza Delight
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            As melhores pizzas da cidade, feitas com ingredientes frescos e
            entrega rápida!
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Link to="/menu">Peça Agora!</Link>
          </Button>
        </div>
      </section>

      {/* Ofertas Especiais */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Ofertas Especiais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.filter(pizza => pizza.isSpecialOffer).map((pizza) => (
              <Card key={pizza.id} className="border-2 border-red-200">
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      Oferta Especial
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {pizza.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{pizza.description}</p>
                  <p className="text-green-600 font-bold text-lg">
                    {formatPrice(pizza.basePrice)}
                  </p>
                  <Button 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      const defaultOptions = {
                        'Borda': pizza.options.find(opt => opt.name === 'Borda')?.choices.find(choice => choice.price === 0)?.id || 'sem-borda',
                        'Tamanho': pizza.options.find(opt => opt.name === 'Tamanho')?.choices.find(choice => choice.price === 0)?.id || 'tamanho-media',
                        'Adicionais': pizza.options.find(opt => opt.name === 'Adicionais')?.choices.find(choice => choice.price === 0)?.id || 'sem-adicional'
                      };
                      
                      const itemToAdd = {
                        id: pizza.id,
                        name: pizza.name,
                        basePrice: pizza.basePrice,
                        selectedOptions: defaultOptions,
                        isSpecialOffer: true
                      };
                      
                      addToCart(itemToAdd);
                    }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Nossas Pizzas Mais Pedidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.slice(0, 3).map((pizza) => (
              <Card key={pizza.id}>
                <CardContent className="p-4">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {pizza.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{pizza.description}</p>
                  <p className="text-green-600 font-bold text-lg">
                    {formatPrice(pizza.basePrice)}
                  </p>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                    <Link to="/menu">
                      Ver opções e pedir
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobre" className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Sobre Nós
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
              <p className="text-gray-700 leading-7 mb-4">
                A Talola Pizza Delight nasceu da paixão por pizza e do desejo de
                oferecer uma experiência gastronômica única aos nossos clientes.
                Utilizamos ingredientes frescos e de alta qualidade, combinados
                com receitas exclusivas, para criar pizzas irresistíveis.
              </p>
              <p className="text-gray-700 leading-7">
                Nossa missão é proporcionar momentos de alegria e sabor em cada
                pedaço, seja em um jantar em família, uma festa com amigos ou
                um simples desejo de saborear uma pizza deliciosa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Entre em Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Informações de Contato
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Endereço:</strong> Rua das Pizzas, 123 - Centro
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Telefone:</strong> (11) 98765-4321
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> contato@talolapizza.com.br
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Envie uma Mensagem
              </h3>
              <form>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Seu Nome"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder="Seu Email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4">
                  <Input
                    placeholder="Sua Mensagem"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center">
        <p className="text-gray-600">
          &copy; 2023 Talola Pizza Delight. Todos os direitos reservados.
        </p>
      </footer>

      {/* Mobile Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden fixed bottom-4 right-4 z-50">
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
