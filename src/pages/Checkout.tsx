
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Smartphone, Banknote, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import StoreStatusBanner from '@/components/StoreStatusBanner';

interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkStoreInteraction, isOpen } = useStoreStatus();
  const cartItems: CartItem[] = location.state?.cartItems || JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 5.00;
  const finalTotal = total + deliveryFee;

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    complement: '',
    paymentMethod: 'pix'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      toast.error('Loja fechada! Não é possível finalizar pedidos.');
      navigate('/');
    }
  }, [isOpen, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkStoreInteraction()) {
      navigate('/');
      return;
    }
    
    setLoading(true);

    try {
      // Criar cliente
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phone
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Criar endereço de entrega
      const addressParts = customerData.address.split(',').map(part => part.trim());
      const { data: addressResult, error: addressError } = await supabase
        .from('delivery_addresses')
        .insert({
          customer_id: customerResult.id,
          street: addressParts[0] || customerData.address,
          number: addressParts[1] || '0',
          complement: customerData.complement,
          neighborhood: addressParts[2] || 'Centro',
          city: addressParts[3] || 'Rio de Janeiro',
          is_default: true
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // Criar pedido
      const estimatedDeliveryTime = new Date(Date.now() + 45 * 60000).toISOString();
      
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerResult.id,
          delivery_address_id: addressResult.id,
          subtotal: total,
          delivery_fee: deliveryFee,
          total: finalTotal,
          payment_method: customerData.paymentMethod,
          payment_status: customerData.paymentMethod === 'pix' ? 'pending' : 'not_required',
          status: 'pending',
          notes: `Items: ${cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}`,
          estimated_delivery_time: estimatedDeliveryTime
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Criar itens do pedido
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderResult.id,
            product_id: item.id.split('-')[0],
            quantity: item.quantity,
            unit_price: item.basePrice,
            total_price: item.totalPrice,
            customizations: item.selectedOptions || {}
          });

        if (itemError) throw itemError;
      }

      // Limpar carrinho
      localStorage.removeItem('cart');

      const orderData = {
        ...orderResult,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        items: cartItems,
        total_amount: finalTotal
      };

      toast.success('Pedido realizado com sucesso!');
      
      // Redirecionar baseado no método de pagamento
      if (customerData.paymentMethod === 'pix') {
        navigate('/payment-confirmation', { state: { order: orderData } });
      } else {
        navigate('/order-tracking', { state: { order: orderData } });
      }
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      if (error.message?.includes('Loja fechada')) {
        toast.error('Loja fechada! Funcionamos das 18:00 às 00:00');
        navigate('/');
      } else {
        toast.error('Erro ao realizar pedido. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-black/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-white mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => navigate('/menu')} className="bg-red-600 hover:bg-red-700">
              Voltar ao Cardápio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      <StoreStatusBanner />

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/menu')}
                className="text-white hover:text-orange-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao Menu
              </Button>
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FINALIZAR PEDIDO</h1>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                    {isOpen ? 'Aberto até 00:00' : 'Loja Fechada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-orange-200">{item.quantity}x</p>
                    </div>
                    <p className="font-medium text-green-400">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
                <div className="border-t border-white/20 pt-4 space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Taxa de entrega:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20 text-green-400">
                    <span>Total:</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Cliente */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(21) 99999-9999"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    required
                    placeholder="Rua, número, bairro, cidade"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="complement" className="text-white">Complemento (opcional)</Label>
                  <Input
                    id="complement"
                    placeholder="Apartamento, bloco, referência"
                    value={customerData.complement}
                    onChange={(e) => setCustomerData({...customerData, complement: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label className="text-white">Forma de Pagamento</Label>
                  <RadioGroup
                    value={customerData.paymentMethod}
                    onValueChange={(value) => setCustomerData({...customerData, paymentMethod: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 rounded-lg border border-green-400/30">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 text-white flex-1">
                        <Smartphone className="h-4 w-4" />
                        <div>
                          <div className="font-semibold">PIX - Pagamento Adiantado</div>
                          <div className="text-sm text-green-300">Chave: (21) 97540-6476</div>
                          <div className="text-xs text-green-200">Confirme o pagamento antes da entrega</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-4 rounded-lg border border-yellow-400/30">
                      <RadioGroupItem value="money" id="money" />
                      <Label htmlFor="money" className="flex items-center gap-2 text-white flex-1">
                        <Banknote className="h-4 w-4" />
                        <div>
                          <div className="font-semibold">Dinheiro na Entrega</div>
                          <div className="text-sm text-yellow-300">Pagamento direto com o entregador</div>
                          <div className="text-xs text-yellow-200">Tenha o valor exato se possível</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3" 
                  disabled={loading || !isOpen}
                >
                  {loading ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
