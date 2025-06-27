import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Truck, ChefHat, MessageCircle, Home, Star } from 'lucide-react';
import { toast } from 'sonner';
import OrderReview from '@/components/OrderReview';

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

interface OrderReviewData {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [existingReview, setExistingReview] = useState<OrderReviewData | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    fetchExistingReview();

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
          
          // Se o pedido foi entregue, mostrar opção de avaliação
          if (payload.new.status === 'completed' && !existingReview) {
            setShowReviewForm(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order, navigate, existingReview]);

  const fetchExistingReview = async () => {
    if (!order) return;

    try {
      // Use raw SQL to fetch review since the table might not be in types yet
      const { data, error } = await supabase.rpc('execute_sql', {
        query: `
          SELECT id, rating, comment, created_at 
          FROM order_reviews 
          WHERE order_id = $1
        `,
        params: [order.id]
      });

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar avaliação:', error);
        return;
      }

      if (data && data.length > 0) {
        setExistingReview(data[0] as OrderReviewData);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

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
      
      if (!existingReview) {
        setShowReviewForm(true);
      }
      
      toast.success('Entrega confirmada!');
    } catch (error: any) {
      console.error('Erro ao confirmar entrega:', error);
      toast.error('Erro ao confirmar entrega');
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchExistingReview();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-black/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-white mb-4">Pedido não encontrado</p>
            <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
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
          description: 'Aguardando confirmação',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/20'
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          text: 'Pedido Confirmado',
          description: 'Iniciando preparo',
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/20'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'Preparando',
          description: 'Sua pizza está sendo preparada',
          color: 'text-orange-400',
          bgColor: 'bg-orange-400/20'
        };
      case 'ready':
        return {
          icon: CheckCircle2,
          text: 'Pronto',
          description: 'Saindo para entrega',
          color: 'text-green-400',
          bgColor: 'bg-green-400/20'
        };
      case 'delivering':
        return {
          icon: Truck,
          text: 'Saindo para Entrega',
          description: 'A caminho do seu endereço',
          color: 'text-purple-400',
          bgColor: 'bg-purple-400/20'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Entregue',
          description: 'Pedido concluído',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20'
        };
      default:
        return {
          icon: Clock,
          text: 'Processando',
          description: 'Verificando status',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20'
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
    { key: 'ready', text: 'Pronto', icon: CheckCircle2 },
    { key: 'delivering', text: 'Entregando', icon: Truck },
    { key: 'completed', text: 'Entregue', icon: CheckCircle2 }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ACOMPANHAR PEDIDO</h1>
                <p className="text-orange-300">Pedido #{order.id.slice(-8)}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:text-orange-300"
            >
              <Home className="h-5 w-5 mr-2" />
              Início
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Principal */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <div className={`${statusInfo.bgColor} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6`}>
                <IconComponent className={`h-12 w-12 ${statusInfo.color}`} />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.text}
              </h2>
              <p className="text-white text-lg mb-6">{statusInfo.description}</p>
              
              {order.estimated_delivery_time && order.status !== 'completed' && (
                <div className="bg-white/10 rounded-lg p-4 inline-block">
                  <p className="text-orange-200">Previsão de entrega:</p>
                  <p className="text-white font-bold">
                    {new Date(order.estimated_delivery_time).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Botão confirmar entrega quando status é delivering */}
              {order.status === 'delivering' && (
                <div className="mt-6">
                  <Button
                    onClick={handleConfirmDelivery}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    Confirmar Entrega
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Acompanhamento do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2
                        ${isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-white/10 border-white/20 text-gray-400'
                        }
                        ${isCurrent ? 'ring-4 ring-green-500/30' : ''}
                      `}>
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                          {step.text}
                        </p>
                        {isCurrent && (
                          <p className="text-green-400 text-sm">Em andamento</p>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Avaliação */}
          {showReviewForm && !existingReview && order.status === 'completed' && (
            <OrderReview
              orderId={order.id}
              customerId={order.customer_id}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}

          {/* Avaliação Existente */}
          {existingReview && (
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Sua Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= existingReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                {existingReview.comment && (
                  <p className="text-white">{existingReview.comment}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  Avaliado em {new Date(existingReview.created_at).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Detalhes do Pedido */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-orange-200">Pedido:</span>
                  <span className="text-white">#{order.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Cliente:</span>
                  <span className="text-white">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Telefone:</span>
                  <span className="text-white">{order.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-200">Pagamento:</span>
                  <Badge className={
                    order.payment_status === 'paid' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }>
                    {order.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20">
                  <span className="text-white">Total:</span>
                  <span className="text-green-400">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">{order.customer_address}</p>
                
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => window.open(whatsappUrl, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contatar no WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/menu')}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Fazer Novo Pedido
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
