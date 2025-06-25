
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedOptions?: Record<string, any>;
  isSpecialOffer?: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate QR Code data for PIX with correct recipient info
      const qrCodeData = customerData.paymentMethod === 'pix' 
        ? generatePixQRCode(finalTotal, customerData.name)
        : null;

      // Create customer first
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phone
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create delivery address
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

      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerResult.id,
          delivery_address_id: addressResult.id,
          subtotal: total,
          delivery_fee: deliveryFee,
          total: finalTotal,
          payment_method: customerData.paymentMethod,
          payment_status: customerData.paymentMethod === 'pix' ? 'pending' : 'paid',
          status: 'pending',
          notes: `Items: ${cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderResult.id,
            product_id: item.isSpecialOffer ? null : item.id, // Special offers don't have product_id
            quantity: item.quantity,
            unit_price: item.basePrice,
            total_price: item.totalPrice,
            customizations: item.selectedOptions || {}
          });

        if (itemError) throw itemError;
      }

      // Clear cart after successful order
      localStorage.removeItem('cart');

      toast.success('Pedido realizado com sucesso!');
      
      if (customerData.paymentMethod === 'pix') {
        navigate('/payment-confirmation', { 
          state: { 
            order: { 
              ...orderResult, 
              customer_name: customerData.name,
              customer_phone: customerData.phone,
              customer_address: customerData.address,
              items: cartItems,
              total_amount: finalTotal,
              qr_code_data: qrCodeData
            }
          } 
        });
      } else {
        navigate('/order-success', { 
          state: { 
            order: {
              ...orderResult,
              customer_name: customerData.name,
              customer_phone: customerData.phone,
              customer_address: customerData.address,
              items: cartItems,
              total_amount: finalTotal
            }
          } 
        });
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao realizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const generatePixQRCode = (amount: number, customerName: string) => {
    // PIX QR Code generation with correct recipient data
    const pixData = {
      amount: amount.toFixed(2),
      description: `Pedido TALOLA - ${customerName}`,
      merchantName: 'Rayane Cabral',
      merchantPhone: '21975406476',
      merchantCity: 'Rio de Janeiro',
      txId: `TALOLA${Date.now()}`
    };
    return JSON.stringify(pixData);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => navigate('/menu')}>
              Voltar ao Cardápio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-red-600">Finalizar Pedido</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity}x</p>
                      {item.isSpecialOffer && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Oferta Especial
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">R$ {item.totalPrice.toFixed(2).replace('.', ',')}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega:</span>
                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(21) 99999-9999"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    required
                    placeholder="Rua, número, bairro, cidade"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="complement">Complemento (opcional)</Label>
                  <Input
                    id="complement"
                    placeholder="Apartamento, bloco, referência"
                    value={customerData.complement}
                    onChange={(e) => setCustomerData({...customerData, complement: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Forma de Pagamento</Label>
                  <RadioGroup
                    value={customerData.paymentMethod}
                    onValueChange={(value) => setCustomerData({...customerData, paymentMethod: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        PIX - Rayane Cabral
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Cartão (na entrega)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="money" id="money" />
                      <Label htmlFor="money" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Dinheiro (na entrega)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
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
