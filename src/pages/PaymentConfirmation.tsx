
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Copy, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    // Simulate PIX payment confirmation after 30 seconds for demo
    const timer = setTimeout(() => {
      confirmPayment();
    }, 30000);

    return () => clearTimeout(timer);
  }, [order]);

  const confirmPayment = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      setPaymentStatus('confirmed');
      toast.success('Pagamento confirmado!');
      
      setTimeout(() => {
        navigate('/order-success', { state: { order } });
      }, 2000);
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

  const copyPixData = () => {
    const pixInfo = `PIX para: Rayane Cabral\nTelefone: (21) 97540-6476\nValor: R$ ${order?.total_amount?.toFixed(2).replace('.', ',')}\nPedido: ${order?.id}`;
    navigator.clipboard.writeText(pixInfo);
    toast.success('Dados do PIX copiados!');
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {paymentStatus === 'confirmed' ? (
              <CheckCircle className="h-16 w-16 text-green-600" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {paymentStatus === 'confirmed' ? 'Pagamento Confirmado!' : 'Aguardando Pagamento PIX'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentStatus === 'pending' && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Dados para PIX
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> Rayane Cabral</p>
                  <p><strong>Telefone:</strong> (21) 97540-6476</p>
                  <p><strong>Valor:</strong> R$ {order.total_amount?.toFixed(2).replace('.', ',')}</p>
                </div>
                <Button 
                  onClick={copyPixData}
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Dados do PIX
                </Button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Após realizar o pagamento, aguarde a confirmação automática.
                </p>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Aguardando pagamento...
                </Badge>
              </div>
            </>
          )}

          {paymentStatus === 'confirmed' && (
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 mb-4">
                Pagamento confirmado
              </Badge>
              <p className="text-gray-600 text-sm">
                Redirecionando para confirmação do pedido...
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Pedido:</span>
                <span>#{order.id?.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>R$ {order.total_amount?.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => window.open('https://wa.me/5521975406476', '_blank')}
              variant="outline" 
              className="w-full"
            >
              Contatar no WhatsApp
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
