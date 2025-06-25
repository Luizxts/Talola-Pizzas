
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageCircle } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Pedido não encontrado</p>
            <Button onClick={() => navigate('/menu')}>
              Voltar ao Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const whatsappMessage = `Olá! Meu pedido #${order.id.slice(-8)} foi confirmado. Aguardo o contato para entrega. Obrigado!`;
  const whatsappUrl = `https://wa.me/5521975406476?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">
            Pedido Confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              Pedido #{order.id.slice(-8)}
            </p>
            <p className="text-sm text-gray-600">
              Seu pedido foi confirmado com sucesso!
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Próximos Passos:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Entraremos em contato via WhatsApp</li>
              <li>• Tempo de preparo: 30-45 minutos</li>
              <li>• Você receberá atualizações do status</li>
            </ul>
          </div>

          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Telefone:</span>
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Pagamento:</span>
              <span className="capitalize">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-semibold">
                R$ {order.total_amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar no WhatsApp
            </Button>
            
            <Button
              onClick={() => navigate('/menu')}
              variant="outline"
              className="w-full"
            >
              Fazer Novo Pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
