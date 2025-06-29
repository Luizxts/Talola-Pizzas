
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Clock, Sparkles } from 'lucide-react';
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
    toast.success('🍕 Item adicionado ao carrinho!', {
      description: `${item.name} foi adicionado com sucesso`
    });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-orange-500 border-r-red-500 mx-auto mb-6"></div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Carregando cardápio delicioso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StoreStatusBanner />

      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg">
                    T
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    CARDÁPIO ESPECIAL
                  </h1>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className={`font-semibold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                      {isOpen ? '🟢 Aberto até 00:00' : '🔴 Loja Fechada'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`px-6 py-3 text-lg font-bold ${isOpen ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-slate-700'} text-white shadow-lg`}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Menu Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-700/50 h-14">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-white font-semibold text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-300 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {category.name === 'Combos e Promoções' && <Sparkles className="h-4 w-4" />}
                      <span>{category.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
                      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <p className="text-slate-300 text-lg leading-relaxed">{category.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        {products[category.id]?.map((product) => (
                          <MenuCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            basePrice={product.base_price}
                            imageUrl={product.image_url}
                            preparationTime={product.preparation_time}
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

          {/* Enhanced Cart Sidebar */}
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
