
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
}

interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemIndex: number, newQuantity: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  onCheckout: () => void;
}

const OrderCart: React.FC<OrderCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardContent className="text-center py-8">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Seu carrinho está vazio</p>
          <p className="text-sm text-gray-400 mt-2">
            Adicione itens do cardápio para começar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Seu Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}-${JSON.stringify(item.selectedOptions)}`} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Special Offer Badge */}
              {item.isSpecialOffer && (
                <Badge className="bg-green-100 text-green-800 text-xs mb-2">
                  Oferta Especial
                </Badge>
              )}
              
              {/* Selected Options */}
              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <div className="text-xs text-gray-600 mb-2">
                  {Object.entries(item.selectedOptions).map(([key, option]: [string, any]) => (
                    <Badge key={key} variant="outline" className="mr-1 text-xs">
                      {option?.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium px-2">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-semibold text-sm">{formatPrice(item.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxa de entrega</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          size="lg"
        >
          Finalizar Pedido - {formatPrice(total)}
        </Button>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Formas de pagamento:</p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">PIX</Badge>
            <Badge variant="outline" className="text-xs">Cartão</Badge>
            <Badge variant="outline" className="text-xs">Dinheiro</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCart;
