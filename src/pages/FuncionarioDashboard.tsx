
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  DollarSign, 
  Package, 
  LogOut,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
  estimated_delivery_time?: string;
}

interface Stats {
  pending: number;
  preparing: number;
  ready: number;
  delivering: number;
  completed: number;
  todayrevenue: number;
  monthrevenue: number;
  yearrevenue: number;
}

const FuncionarioDashboard = () => {
  const navigate = useNavigate();
  const { storeStatus, toggleStoreStatus } = useStoreStatus();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    preparing: 0,
    ready: 0,
    delivering: 0,
    completed: 0,
    todayrevenue: 0,
    monthrevenue: 0,
    yearrevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showStoreToggle, setShowStoreToggle] = useState(false);

  useEffect(() => {
    // Verificar se funcionário está autenticado
    const isAuthenticated = localStorage.getItem('funcionario_authenticated');
    if (!isAuthenticated) {
      navigate('/funcionario-login');
      return;
    }

    fetchOrders();
    fetchStats();

    // Configurar real-time updates
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPeriod, selectedStatus, navigate]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          id,
          status,
          payment_status,
          payment_method,
          total,
          created_at,
          estimated_delivery_time,
          customers!inner(name, phone),
          delivery_addresses!inner(street, number, neighborhood, city)
        `)
        .order('created_at', { ascending: false });

      // Filtrar por período
      if (selectedPeriod !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (selectedPeriod) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = null;
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Filtrar por status
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Mapear os resultados para o formato esperado
      const formattedOrders = data?.map((order: any) => ({
        id: order.id,
        status: order.status,
        payment_status: order.payment_status || 'pending',
        payment_method: order.payment_method,
        total: order.total,
        customer_name: order.customers?.name || 'Cliente',
        customer_phone: order.customers?.phone || '',
        customer_address: order.delivery_addresses ? 
          `${order.delivery_addresses.street}, ${order.delivery_addresses.number} - ${order.delivery_addresses.neighborhood}, ${order.delivery_addresses.city}` :
          'Endereço não informado',
        created_at: order.created_at,
        estimated_delivery_time: order.estimated_delivery_time
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setStats({
          pending: Number(data.pending) || 0,
          preparing: Number(data.preparing) || 0,
          ready: Number(data.ready) || 0,
          delivering: Number(data.delivering) || 0,
          completed: Number(data.completed) || 0,
          todayrevenue: Number(data.todayrevenue) || 0,
          monthrevenue: Number(data.monthrevenue) || 0,
          yearrevenue: Number(data.yearrevenue) || 0
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'confirmed') {
        updates.confirmed_at = new Date().toISOString();
        // Estimar tempo de entrega (45 minutos a partir de agora)
        const estimatedTime = new Date();
        estimatedTime.setMinutes(estimatedTime.getMinutes() + 45);
        updates.estimated_delivery_time = estimatedTime.toISOString();
      } else if (newStatus === 'completed') {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Status do pedido atualizado!');
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('Erro ao atualizar pedido');
    }
  };

  const confirmPayment = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Pagamento confirmado!');
      fetchOrders();
    } catch (error: any) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('funcionario_authenticated');
    navigate('/funcionario-login');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          text: 'Pendente', 
          color: 'bg-yellow-500',
          nextStatus: 'confirmed',
          nextText: 'Confirmar'
        };
      case 'confirmed':
        return { 
          icon: CheckCircle2, 
          text: 'Confirmado', 
          color: 'bg-blue-500',
          nextStatus: 'preparing',
          nextText: 'Iniciar Preparo'
        };
      case 'preparing':
        return { 
          icon: ChefHat, 
          text: 'Preparando', 
          color: 'bg-orange-500',
          nextStatus: 'ready',
          nextText: 'Pronto'
        };
      case 'ready':
        return { 
          icon: CheckCircle2, 
          text: 'Pronto', 
          color: 'bg-green-500',
          nextStatus: 'delivering',
          nextText: 'Saiu para Entrega'
        };
      case 'delivering':
        return { 
          icon: Truck, 
          text: 'Entregando', 
          color: 'bg-purple-500',
          nextStatus: 'completed',
          nextText: 'Entregue'
        };
      case 'completed':
        return { 
          icon: CheckCircle2, 
          text: 'Entregue', 
          color: 'bg-green-600',
          nextStatus: null,
          nextText: null
        };
      default:
        return { 
          icon: Clock, 
          text: 'Processando', 
          color: 'bg-gray-500',
          nextStatus: null,
          nextText: null
        };
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-white">PAINEL FUNCIONÁRIO</h1>
                <p className="text-orange-300">Gestão de Pedidos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowStoreToggle(!showStoreToggle)}
                variant="ghost"
                className="text-white hover:text-orange-300"
              >
                {showStoreToggle ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
              {showStoreToggle && (
                <Button
                  onClick={() => toggleStoreStatus('Funcionário')}
                  className={`${
                    storeStatus?.is_open 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {storeStatus?.is_open ? 'Fechar Loja' : 'Abrir Loja'}
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:text-orange-300"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm text-orange-200">Pedidos Pendentes</p>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ChefHat className="h-8 w-8 text-orange-400" />
                  <div className="ml-4">
                    <p className="text-sm text-orange-200">Em Preparo</p>
                    <p className="text-2xl font-bold text-white">{stats.preparing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-purple-400" />
                  <div className="ml-4">
                    <p className="text-sm text-orange-200">Para Entrega</p>
                    <p className="text-2xl font-bold text-white">{stats.ready + stats.delivering}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm text-orange-200">Receita Hoje</p>
                    <p className="text-2xl font-bold text-white">{formatPrice(stats.todayrevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-orange-200 text-sm mb-2 block">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta Semana</SelectItem>
                      <SelectItem value="month">Este Mês</SelectItem>
                      <SelectItem value="year">Este Ano</SelectItem>
                      <SelectItem value="all">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-orange-200 text-sm mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="preparing">Preparando</SelectItem>
                      <SelectItem value="ready">Pronto</SelectItem>
                      <SelectItem value="delivering">Entregando</SelectItem>
                      <SelectItem value="completed">Entregue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pedidos */}
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Pedidos ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-orange-200 py-8">Nenhum pedido encontrado</p>
                ) : (
                  orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={order.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="h-4 w-4 mr-1" />
                                {statusInfo.text}
                              </Badge>
                              <span className="text-white font-mono">#{order.id.slice(-8)}</span>
                              <span className="text-orange-200">{formatTime(order.created_at)}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-orange-200">Cliente:</p>
                                <p className="text-white font-medium">{order.customer_name}</p>
                                <p className="text-gray-300">{order.customer_phone}</p>
                              </div>
                              <div>
                                <p className="text-orange-200">Endereço:</p>
                                <p className="text-white">{order.customer_address}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <div className="text-right mb-4">
                              <p className="text-2xl font-bold text-green-400">{formatPrice(order.total)}</p>
                              <p className="text-sm text-orange-200">{order.payment_method}</p>
                              <Badge className={
                                order.payment_status === 'paid' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-yellow-600 text-white'
                              }>
                                {order.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              {order.payment_status !== 'paid' && (
                                <Button
                                  onClick={() => confirmPayment(order.id)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmar Pagamento
                                </Button>
                              )}
                              
                              {statusInfo.nextStatus && (
                                <Button
                                  onClick={() => updateOrderStatus(order.id, statusInfo.nextStatus!)}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {statusInfo.nextText}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioDashboard;
