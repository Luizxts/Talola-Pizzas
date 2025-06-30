
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus, CreditCard, Truck } from 'lucide-react';

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
      <Card className="sticky top-32 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <CardContent className="text-center py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
            <ShoppingCart className="relative mx-auto h-16 w-16 text-orange-400 mb-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h3>
          <p className="text-slate-300 leading-relaxed">
            Adicione pizzas deliciosas do nosso cardápio e monte seu pedido perfeito!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-32 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <div className="text-xl font-bold">Seu Pedido</div>
            <div className="text-sm text-slate-300 font-normal">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Cart Items */}
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="group bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-xl p-4 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-white leading-tight mb-1">{item.name}</h4>
                  
                  {item.isSpecialOffer && (
                    <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white text-xs mb-2">
                      🎉 Oferta Especial
                    </Badge>
                  )}
                  
                  {item.selectedOptions?.size && (
                    <div className="text-xs text-orange-300 bg-orange-500/10 px-2 py-1 rounded-lg inline-block">
                      📏 {item.selectedOptions.size.name}
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(index)}
                  disabled={!isStoreOpen}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1 || !isStoreOpen}
                    className="h-8 w-8 p-0 border-orange-400/50 text-orange-300 hover:bg-orange-500/20 rounded-full"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-bold text-white bg-slate-800 px-3 py-1 rounded-lg min-w-[2.5rem] text-center border border-slate-600">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    disabled={!isStoreOpen}
                    className="h-8 w-8 p-0 border-orange-400/50 text-orange-300 hover:bg-orange-500/20 rounded-full"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-bold text-lg text-green-400">{formatPrice(item.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

        {/* Order Summary */}
        <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Taxa de entrega
            </span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
          <Separator className="bg-slate-600/50" />
          <div className="flex justify-between font-bold text-xl">
            <span className="text-white">Total</span>
            <span className="text-green-400 text-2xl">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout}
          disabled={!isStoreOpen}
          className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
            isStoreOpen 
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02]' 
              : 'bg-slate-700 cursor-not-allowed text-slate-400'
          }`}
          size="lg"
        >
          {isStoreOpen ? (
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Finalizar Pedido - {formatPrice(total)}
            </div>
          ) : (
            'Loja Fechada'
          )}
        </Button>

        {/* Payment Methods */}
        <div className="text-center p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <p className="text-sm text-slate-300 mb-3 font-semibold">💳 Formas de pagamento aceitas:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-sm border-green-400/50 text-green-300 bg-green-500/10 px-3 py-1">
              🏦 PIX (Antecipado)
            </Badge>
            <Badge variant="outline" className="text-sm border-yellow-400/50 text-yellow-300 bg-yellow-500/10 px-3 py-1">
              💵 Dinheiro (Entrega)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCart;
