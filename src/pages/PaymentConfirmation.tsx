
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Copy, Smartphone, Phone } from 'lucide-react';
import { toast } from 'sonner';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos em segundos

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    // Timer de 30 minutos para expirar o pagamento
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          toast.error('Tempo para pagamento expirado!');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPixData = () => {
    const pixInfo = `PIX para: Rayane Cabral
Telefone: (21) 97540-6476
Valor: R$ ${order?.total_amount?.toFixed(2).replace('.', ',')}
Pedido: #${order?.id?.slice(0, 8)}

Após realizar o pagamento, entre em contato pelo WhatsApp para confirmar.`;
    
    navigator.clipboard.writeText(pixInfo);
    toast.success('Dados do PIX copiados para área de transferência!');
  };

  const confirmPaymentManually = () => {
    toast.info('Entre em contato pelo WhatsApp após realizar o pagamento para confirmar.');
    window.open(`https://wa.me/5521975406476?text=Olá! Acabei de realizar o pagamento PIX do pedido #${order?.id?.slice(0, 8)} no valor de R$ ${order?.total_amount?.toFixed(2).replace('.', ',')}. Aguardo confirmação.`, '_blank');
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-black/60 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <Clock className="relative h-16 w-16 text-orange-400 mx-auto" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            Pagamento PIX Pendente
          </CardTitle>
          <div className="text-orange-300">
            Tempo restante: <span className="font-bold text-orange-200">{formatTime(timeLeft)}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-400/30">
            <h3 className="font-bold text-green-300 mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Dados para PIX
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Nome:</span>
                <span className="text-green-200 font-semibold">Rayane Cabral</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Telefone:</span>
                <span className="text-green-200 font-semibold">(21) 97540-6476</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Valor:</span>
                <span className="text-green-200 font-bold text-lg">R$ {order.total_amount?.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Pedido:</span>
                <span className="text-green-200 font-semibold">#{order.id?.slice(0, 8)}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={copyPixData}
                variant="outline" 
                className="flex-1 bg-green-600/20 border-green-400/50 text-green-200 hover:bg-green-600/30"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Dados
              </Button>
              <Button 
                onClick={confirmPaymentManually}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <h4 className="font-semibold text-white mb-3">Resumo do Pedido</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-200">Pedido:</span>
                <span className="text-white">#{order.id?.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-200">Cliente:</span>
                <span className="text-white">{order.customer_name}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-orange-200">Total:</span>
                <span className="text-green-400">R$ {order.total_amount?.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-xl border border-orange-400/30">
            <h4 className="font-semibold text-orange-300 mb-2">⏰ Instruções Importantes</h4>
            <ul className="text-sm text-orange-200 space-y-1">
              <li>• Realize o pagamento PIX usando os dados acima</li>
              <li>• Após o pagamento, clique em "WhatsApp" para confirmar</li>
              <li>• Seu pedido será confirmado em até 5 minutos</li>
              <li>• Guarde o comprovante de pagamento</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/order-tracking', { state: { order } })}
              variant="outline" 
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Acompanhar Pedido
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="w-full text-orange-300 hover:text-orange-200 hover:bg-orange-500/10"
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
