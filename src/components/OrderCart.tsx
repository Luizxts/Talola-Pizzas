
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
  isSpecialOffer?: boolean;
  productId: string;
}

interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemIndex: number, newQuantity: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  onCheckout: () => void;
  isStoreOpen: boolean;
}

const OrderCart: React.FC<OrderCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isStoreOpen
}) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <Card className="sticky top-32 bg-black/60 backdrop-blur-sm border-white/20">
        <CardContent className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-orange-400 mb-4" />
          <p className="text-orange-200">Seu carrinho está vazio</p>
          <p className="text-sm text-orange-300 mt-2">
            Adicione pizzas deliciosas do nosso cardápio
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-32 bg-black/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ShoppingCart className="h-5 w-5" />
          Seu Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="bg-white/10 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm text-white leading-tight">{item.name}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(index)}
                  disabled={!isStoreOpen}
                  className="text-red-400 hover:text-red-300 p-1 h-6 w-6"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Special Offer Badge */}
              {item.isSpecialOffer && (
                <Badge className="bg-green-600 text-white text-xs mb-2">
                  Oferta Especial
                </Badge>
              )}
              
              {/* Size Display */}
              {item.selectedOptions?.size && (
                <div className="text-xs text-orange-200 mb-2">
                  Tamanho: {item.selectedOptions.size.name}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1 || !isStoreOpen}
                    className="h-6 w-6 p-0 border-white/20 text-white hover:bg-white/10"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium px-2 text-white">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    disabled={!isStoreOpen}
                    className="h-6 w-6 p-0 border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-semibold text-sm text-green-400">{formatPrice(item.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-white/20" />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-orange-200">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-orange-200">
            <span>Taxa de entrega</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <Separator className="bg-white/20" />
          <div className="flex justify-between font-bold text-white">
            <span>Total</span>
            <span className="text-lg text-green-400">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout}
          disabled={!isStoreOpen}
          className={`w-full py-3 text-lg font-bold ${isStoreOpen ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
          size="lg"
        >
          {isStoreOpen ? `Finalizar Pedido - ${formatPrice(total)}` : 'Loja Fechada'}
        </Button>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-orange-300 mb-2">Formas de pagamento:</p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-300">PIX</Badge>
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-300">Cartão</Badge>
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-300">Dinheiro</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCart;
