
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
import MenuCard from '@/components/MenuCard';
import OrderCart from '@/components/OrderCart';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url?: string;
  category_id: string;
  preparation_time: number;
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
  is_required: boolean;
  max_selections?: number;
}

interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
  productId: string;
  isSpecialOffer?: boolean;
}

const Menu = () => {
  const navigate = useNavigate();
  const { checkStoreInteraction, isOpen } = useStoreStatus();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [productOptions, setProductOptions] = useState<Record<string, ProductOption[]>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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

  const addToCart = (item: any) => {
    if (!checkStoreInteraction()) return;

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      name: item.name,
      basePrice: item.basePrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      selectedOptions: item.selectedOptions,
      productId: item.id,
      isSpecialOffer: item.name.includes('Combo') || item.name.includes('Promoção')
    };

    setCartItems([...cartItems, cartItem]);
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
    const pricePerUnit = item.totalPrice / item.quantity;
    
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
                {cartItems.length} itens
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/60 backdrop-blur-sm">
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
                          <MenuCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            basePrice={product.base_price}
                            imageUrl={product.image_url}
                            options={productOptions[product.id]?.map(option => ({
                              id: option.id,
                              name: option.name,
                              priceModifier: option.price_modifier,
                              optionType: option.option_type,
                              isRequired: option.is_required,
                              maxSelections: option.max_selections
                            })) || []}
                            onAddToCart={addToCart}
                            isStoreOpen={isOpen}
                          />
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
            <OrderCart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
              isStoreOpen={isOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
