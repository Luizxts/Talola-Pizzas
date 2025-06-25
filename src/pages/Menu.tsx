
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MenuCard from '@/components/MenuCard';
import OrderCart from '@/components/OrderCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [productOptions, setProductOptions] = useState<Record<string, ProductOption[]>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (productsError) throw productsError;

      // Fetch product options
      const { data: optionsData, error: optionsError } = await supabase
        .from('product_options')
        .select('*');

      if (optionsError) throw optionsError;

      // Group products by category
      const productsByCategory: Record<string, Product[]> = {};
      productsData?.forEach(product => {
        if (!productsByCategory[product.category_id]) {
          productsByCategory[product.category_id] = [];
        }
        productsByCategory[product.category_id].push(product);
      });

      // Group options by product
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
      console.error('Error fetching menu data:', error);
      toast.error('Erro ao carregar o cardápio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: any) => {
    const existingItemIndex = cartItems.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      updatedItems[existingItemIndex].totalPrice += item.totalPrice;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, item]);
    }

    toast.success('Item adicionado ao carrinho!');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const pricePerUnit = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: pricePerUnit * newQuantity
        };
      }
      return item;
    });

    setCartItems(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Item removido do carrinho');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho primeiro');
      return;
    }
    
    // Here you would implement checkout logic
    toast.success('Redirecionando para checkout...');
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Utensils className="mx-auto h-12 w-12 text-red-600 animate-pulse mb-4" />
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-red-600">TALOLA</h1>
                <p className="text-sm text-gray-600">Cardápio</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Delivery disponível</p>
              <p className="font-semibold text-green-600">+55 21 97540-6476</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menu Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl text-gray-800">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <p className="text-gray-600">{category.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {products[category.id]?.map((product) => (
                          <MenuCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            basePrice={product.base_price}
                            imageUrl={product.image_url}
                            options={productOptions[product.id] || []}
                            onAddToCart={handleAddToCart}
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
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
