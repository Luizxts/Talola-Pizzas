import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface ProductOption {
  id: string;
  name: string;
  price_modifier: number;
  option_type: string;
}

interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
}

const Menu = () => {
  const navigate = useNavigate();
  const { checkStoreInteraction, isOpen } = useStoreStatus();
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [productOptions, setProductOptions] = useState<Record<string, ProductOption[]>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStoreHours();
    fetchMenuData();
    loadCart();
    
    const interval = setInterval(checkStoreHours, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const checkStoreHours = () => {
    const hour = new Date().getHours();
    const isOpen = hour >= 18 || hour < 1;
    setIsStoreOpen(isOpen);
    
    if (!isOpen) {
      navigate('/');
    }
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
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

      const { data: optionsData, error: optionsError } = await supabase
        .from('product_options')
        .select('*');

      if (optionsError) throw optionsError;

      const productsByCategory: Record<string, Product[]> = {};
      productsData?.forEach(product => {
        if (!productsByCategory[product.category_id]) {
          productsByCategory[product.category_id] = [];
        }
        productsByCategory[product.category_id].push(product);
      });

      const optionsByProduct: Record<string, ProductOption[]> = {};
      optionsData?.forEach(option => {
        if (!optionsByProduct[option.product_id]) {
          optionsByProduct[option.product_id] = [];
        }
        optionsByProduct[option.product_id].push(option);
      });

      setCategories(categoriesData || []);
      setProducts(productsByCategory);
      setProductOptions(optionsByProduct);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar o cardápio');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, selectedSize?: ProductOption) => {
    if (!checkStoreInteraction()) return;

    const price = product.base_price + (selectedSize?.price_modifier || 0);
    const item: CartItem = {
      id: `${product.id}-${selectedSize?.id || 'default'}`,
      name: `${product.name}${selectedSize ? ` (${selectedSize.name})` : ''}`,
      basePrice: price,
      quantity: 1,
      totalPrice: price,
      selectedOptions: selectedSize ? { size: selectedSize } : {}
    };

    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice += price;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, item]);
    }

    toast.success('Item adicionado ao carrinho!');
  };

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (!checkStoreInteraction()) return;

    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }

    const updatedItems = [...cartItems];
    const item = updatedItems[itemIndex];
    const pricePerUnit = item.basePrice;
    
    updatedItems[itemIndex] = {
      ...item,
      quantity: newQuantity,
      totalPrice: pricePerUnit * newQuantity
    };

    setCartItems(updatedItems);
  };

  const removeItem = (itemIndex: number) => {
    if (!checkStoreInteraction()) return;

    const updatedItems = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedItems);
    toast.success('Item removido do carrinho');
  };

  const handleCheckout = () => {
    if (!checkStoreInteraction()) return;
    navigate('/checkout', { state: { cartItems } });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (!isStoreOpen) {
    return null; // Será redirecionado para home
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      {/* Status Banner */}
      <StoreStatusBanner />

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-orange-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CARDÁPIO</h1>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                    {isOpen ? 'Aberto até 00:00' : 'Loja Fechada'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`px-4 py-2 ${isOpen ? 'bg-red-600' : 'bg-gray-600'} text-white`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cartItems.length} itens - {formatPrice(getCartTotal())}
              </Badge>
              {cartItems.length > 0 && (
                <Button
                  onClick={handleCheckout}
                  disabled={!isOpen}
                  className={`text-white ${isOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
                >
                  Finalizar Pedido
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-black/60 backdrop-blur-sm">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-white data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card className="bg-black/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-3xl text-white">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <p className="text-orange-200">{category.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {products[category.id]?.map((product) => (
                          <Card key={product.id} className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all ${!isOpen ? 'opacity-75' : ''}`}>
                            <CardContent className="p-6">
                              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                              <p className="text-orange-200 mb-4">{product.description}</p>
                              
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-green-400">
                                  {formatPrice(product.base_price)}
                                </span>
                                <Badge className="bg-orange-600 text-white">
                                  30 min
                                </Badge>
                              </div>

                              {/* Opções de tamanho */}
                              {productOptions[product.id]?.length > 0 ? (
                                <div className="space-y-2">
                                  {productOptions[product.id].map((option) => (
                                    <Button
                                      key={option.id}
                                      onClick={() => addToCart(product, option)}
                                      disabled={!isOpen}
                                      className={`w-full justify-between ${isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
                                    >
                                      <span>{option.name}</span>
                                      <span>{formatPrice(product.base_price + option.price_modifier)}</span>
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  onClick={() => addToCart(product)}
                                  disabled={!isOpen}
                                  className={`w-full ${isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
                                >
                                  Adicionar ao Carrinho
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-black/60 backdrop-blur-sm border-white/20 sticky top-32">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Seu Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-orange-200 text-center py-8">
                    Seu carrinho está vazio
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium text-sm">{item.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={!isOpen}
                            className="text-red-400 hover:text-red-300 p-1 h-auto"
                          >
                            ×
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              disabled={!isOpen}
                              className="text-white hover:text-orange-300 p-1 h-auto"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-white font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              disabled={!isOpen}
                              className="text-white hover:text-orange-300 p-1 h-auto"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="text-green-400 font-bold">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-bold text-lg">Total:</span>
                        <span className="text-green-400 font-bold text-xl">
                          {formatPrice(getCartTotal())}
                        </span>
                      </div>
                      
                      <Button
                        onClick={handleCheckout}
                        disabled={!isOpen}
                        className={`w-full text-lg py-3 ${isOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
                      >
                        Finalizar Pedido
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
