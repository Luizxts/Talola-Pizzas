
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Truck, ChefHat, MessageCircle, Home, Package } from 'lucide-react';
import { toast } from 'sonner';
import OrderStatus from '@/components/OrderStatus';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_id: string;
  estimated_delivery_time?: string;
  created_at: string;
  delivered_at?: string;
}

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    // Atualizar status do pedido em tempo real
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`
        },
        (payload) => {
          const updatedOrder = { ...order, ...payload.new } as Order;
          setOrder(updatedOrder);
          
          // Notificar sobre mudanças de status
          if (payload.new.status !== order.status) {
            const statusMessages = {
              confirmed: 'Pedido confirmado! Iniciando preparo.',
              preparing: 'Sua pizza está sendo preparada com carinho!',
              ready: 'Pedido pronto! Saindo para entrega.',
              delivering: 'Pedido a caminho! Chegando em breve.',
              completed: 'Pedido entregue! Obrigado pela preferência.'
            };
            
            const message = statusMessages[payload.new.status as keyof typeof statusMessages];
            if (message) {
              toast.success(message);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order, navigate]);

  const handleConfirmDelivery = async () => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          delivered_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      setOrder({ ...order, status: 'completed', delivered_at: new Date().toISOString() });
      toast.success('Entrega confirmada! Obrigado pela preferência!');
    } catch (error: any) {
      console.error('Erro ao confirmar entrega:', error);
      toast.error('Erro ao confirmar entrega');
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="bg-red-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-white text-lg sm:text-xl font-semibold mb-6">Pedido não encontrado</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 sm:px-8 py-3 rounded-xl w-full"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pedido Recebido',
          description: 'Aguardando confirmação do restaurante',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/20',
          borderColor: 'border-yellow-400/50'
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          text: 'Pedido Confirmado',
          description: 'Iniciando preparo da sua pizza',
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/20',
          borderColor: 'border-blue-400/50'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'Preparando',
          description: 'Sua pizza está sendo preparada com carinho',
          color: 'text-orange-400',
          bgColor: 'bg-orange-400/20',
          borderColor: 'border-orange-400/50'
        };
      case 'ready':
        return {
          icon: Package,
          text: 'Pronto para Entrega',
          description: 'Pizza pronta, saindo para entrega',
          color: 'text-purple-400',
          bgColor: 'bg-purple-400/20',
          borderColor: 'border-purple-400/50'
        };
      case 'delivering':
        return {
          icon: Truck,
          text: 'Saindo para Entrega',
          description: 'A caminho do seu endereço',
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-400/20',
          borderColor: 'border-indigo-400/50'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Pedido Entregue',
          description: 'Entregue com sucesso!',
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          borderColor: 'border-green-400/50'
        };
      default:
        return {
          icon: Clock,
          text: 'Processando',
          description: 'Verificando status do pedido',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          borderColor: 'border-gray-400/50'
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const IconComponent = statusInfo.icon;

  const whatsappMessage = `Olá! Gostaria de saber sobre meu pedido #${order.id.slice(-8)}. Obrigado!`;
  const whatsappUrl = `https://wa.me/5521975406476?text=${encodeURIComponent(whatsappMessage)}`;

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const steps = [
    { key: 'pending', text: 'Recebido', icon: Clock },
    { key: 'confirmed', text: 'Confirmado', icon: CheckCircle2 },
    { key: 'preparing', text: 'Preparando', icon: ChefHat },
    { key: 'ready', text: 'Pronto', icon: Package },
    { key: 'delivering', text: 'Entregando', icon: Truck },
    { key: 'completed', text: 'Entregue', icon: CheckCircle2 }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg">
                  T
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  ACOMPANHAR PEDIDO
                </h1>
                <p className="text-orange-300 text-sm sm:text-lg">Pedido #{order.id.slice(-8)}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 p-2 sm:p-3"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Início</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Status Principal */}
          <Card className={`bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl ${statusInfo.borderColor}`}>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className={`${statusInfo.bgColor} rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto mb-6 sm:mb-8 border-2 ${statusInfo.borderColor}`}>
                <IconComponent className={`h-12 w-12 sm:h-16 sm:w-16 ${statusInfo.color}`} />
              </div>
              <h2 className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${statusInfo.color}`}>
                {statusInfo.text}
              </h2>
              <p className="text-white text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed px-2">{statusInfo.description}</p>
              
              {order.estimated_delivery_time && order.status !== 'completed' && (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 sm:p-6 inline-block border border-orange-500/20 max-w-sm mx-auto">
                  <p className="text-orange-300 text-base sm:text-lg font-semibold mb-2">Previsão de entrega:</p>
                  <p className="text-white font-bold text-2xl sm:text-3xl">
                    {new Date(order.estimated_delivery_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Botão confirmar entrega quando status é delivering */}
              {order.status === 'delivering' && (
                <div className="mt-6 sm:mt-8">
                  <Button
                    onClick={handleConfirmDelivery}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 w-full sm:w-auto"
                    size="lg"
                  >
                    ✅ Confirmar Entrega
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
              <CardTitle className="text-white text-xl sm:text-2xl font-bold">Status do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex items-center space-x-4 sm:space-x-6">
                      <div className={`
                        w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white shadow-lg' 
                          : 'bg-slate-800/50 border-slate-600 text-gray-400'
                        }
                        ${isCurrent ? 'ring-4 ring-green-500/30 scale-110 animate-pulse' : ''}
                      `}>
                        <StepIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-lg sm:text-xl ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                          {step.text}
                        </p>
                        {isCurrent && (
                          <p className="text-green-400 text-xs sm:text-sm font-semibold animate-pulse">● Em andamento</p>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Pedido */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
                <CardTitle className="text-white text-lg sm:text-xl font-bold">Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-orange-300 font-semibold text-sm sm:text-base">Pedido:</span>
                  <span className="text-white font-mono font-bold text-sm sm:text-base">#{order.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-orange-300 font-semibold text-sm sm:text-base">Status:</span>
                  <OrderStatus status={order.status} size="sm" />
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-orange-300 font-semibold text-sm sm:text-base">Pagamento:</span>
                  <Badge className={
                    order.payment_status === 'paid' 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white text-xs sm:text-sm' 
                      : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs sm:text-sm'
                  }>
                    {order.payment_status === 'paid' ? '✅ Pago' : '⏳ Pendente'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                  <span className="text-white font-bold text-lg sm:text-xl">Total:</span>
                  <span className="text-green-400 font-bold text-xl sm:text-2xl">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700/50">
                <CardTitle className="text-white text-lg sm:text-xl font-bold">Contato e Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-orange-300 text-xs sm:text-sm font-semibold mb-2">Endereço de entrega:</p>
                  <p className="text-white leading-relaxed text-sm sm:text-base">{order.customer_address}</p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-green-500/25 text-sm sm:text-base"
                  >
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Contatar no WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/menu')}
                    variant="outline"
                    className="w-full border-orange-400/50 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
                  >
                    🍕 Fazer Novo Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
