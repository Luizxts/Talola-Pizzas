
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Copy } from 'lucide-react';
import { toast } from 'sonner';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, qrCodeData } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    if (!order) {
      navigate('/menu');
      return;
    }

    // Check payment status every 10 seconds
    const checkPayment = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('payment_status')
        .eq('id', order.id)
        .single();

      if (data?.payment_status === 'confirmed') {
        setPaymentStatus('confirmed');
        clearInterval(checkPayment);
        setTimeout(() => navigate('/order-success', { state: { order } }), 2000);
      }
    }, 10000);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(checkPayment);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(checkPayment);
      clearInterval(timer);
    };
  }, [order, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPixCode = () => {
    // In production, generate actual PIX code
    const pixCode = `00020126580014br.gov.bcb.pix01364d7f1b4e-7b2c-4c5e-9f3a-1a2b3c4d5e6f7g8h9i0j520400005303986540${order.total_amount.toFixed(2)}5802BR5925TALOLA PIZZAS E BURGERS6014RIO DE JANEIRO62070503***6304`;
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado!');
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {paymentStatus === 'confirmed' ? 'Pagamento Confirmado!' : 'Aguardando Pagamento'}
          </CardTitle>
          {paymentStatus === 'confirmed' ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mt-4" />
          ) : (
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mt-4" />
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentStatus === 'pending' && (
            <>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  R$ {order.total_amount.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-600">
                  Tempo restante: {formatTime(timeLeft)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">
                    QR Code PIX<br />
                    (Demonstração)
                  </p>
                </div>
                <Button
                  onClick={copyPixCode}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código PIX
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Escaneie o QR Code ou cole o código PIX no seu banco</p>
                <p className="mt-2">O pagamento será confirmado automaticamente</p>
              </div>
            </>
          )}

          {paymentStatus === 'confirmed' && (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                Seu pagamento foi confirmado!
              </p>
              <p className="text-sm text-gray-600">
                Redirecionando para confirmação do pedido...
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pedido:</span>
              <span className="font-mono">#{order.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{order.customer_name}</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="w-full"
          >
            Voltar ao Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
