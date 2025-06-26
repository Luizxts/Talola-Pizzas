
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  LogOut,
  Bell,
  ChefHat,
  Truck,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderWithDetails {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
  estimated_delivery_time?: string;
  customers?: {
    name: string;
    phone: string;
  };
  delivery_addresses?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
  };
  order_items?: Array<{
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: {
      name: string;
    };
  }>;
  notes?: string;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    deliveringOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem('staff_authenticated');
    if (!isAuthenticated) {
      navigate('/staff-login');
      return;
    }

    fetchOrders();
    
    // Atualizar a cada 10 segundos
    const interval = setInterval(fetchOrders, 10000);
    
    // Real-time updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
          toast.success('Novo pedido recebido!', {
            duration: 5000,
          });
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, phone),
          delivery_addresses (street, number, complement, neighborhood, city),
          order_items (quantity, unit_price, total_price, products (name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders: OrderWithDetails[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.created_at.startsWith(today)
    );
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      preparingOrders: orders.filter(order => order.status === 'preparing').length,
      readyOrders: orders.filter(order => order.status === 'ready').length,
      deliveringOrders: orders.filter(order => order.status === 'delivering').length,
      completedOrders: orders.filter(order => order.status === 'delivered').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
    };
    
    setStats(stats);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updateData: any = { status };
      
      // Adicionar timestamps específicos
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Status atualizado com sucesso!');
      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const confirmPayment = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Pagamento confirmado!');
      fetchOrders();
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staff_authenticated');
    localStorage.removeItem('staff_username');
    navigate('/staff-login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm shadow-xl border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">TALOLA PIZZA</h1>
                <p className="text-orange-300">Dashboard Administrativo</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 ml-4">
                <Bell className="h-3 w-3 mr-1" />
                {stats.pendingOrders} Pendentes
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleLogout} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Preparando</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.preparingOrders}</p>
                </div>
                <ChefHat className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Prontos</p>
                  <p className="text-2xl font-bold text-green-400">{stats.readyOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Entregando</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.deliveringOrders}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Hoje</p>
                  <p className="text-xl font-bold text-green-400">{formatPrice(stats.todayRevenue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-200">Total</p>
                  <p className="text-xl font-bold text-green-400">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/10">
                <TabsTrigger value="pending" className="text-white data-[state=active]:bg-yellow-600">
                  Pendentes ({stats.pendingOrders})
                </TabsTrigger>
                <TabsTrigger value="preparing" className="text-white data-[state=active]:bg-orange-600">
                  Preparando ({stats.preparingOrders})
                </TabsTrigger>
                <TabsTrigger value="ready" className="text-white data-[state=active]:bg-green-600">
                  Prontos ({stats.readyOrders})
                </TabsTrigger>
                <TabsTrigger value="delivering" className="text-white data-[state=active]:bg-purple-600">
                  Entregando ({stats.deliveringOrders})
                </TabsTrigger>
                <TabsTrigger value="delivered" className="text-white data-[state=active]:bg-gray-600">
                  Entregues ({stats.completedOrders})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-blue-600">
                  Todos
                </TabsTrigger>
              </TabsList>

              {['pending', 'preparing', 'ready', 'delivering', 'delivered', 'all'].map(status => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {orders
                    .filter(order => status === 'all' || order.status === status)
                    .map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        onStatusUpdate={updateOrderStatus}
                        onPaymentConfirm={confirmPayment}
                        getStatusColor={getStatusColor}
                        formatPrice={formatPrice}
                      />
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente do Card de Pedido
const OrderCard = ({ 
  order, 
  onStatusUpdate, 
  onPaymentConfirm,
  getStatusColor,
  formatPrice
}: { 
  order: OrderWithDetails; 
  onStatusUpdate: (id: string, status: string) => void;
  onPaymentConfirm: (id: string) => void;
  getStatusColor: (status: string) => string;
  formatPrice: (price: number) => string;
}) => {
  const formatAddress = () => {
    if (!order.delivery_addresses) return 'Endereço não disponível';
    const addr = order.delivery_addresses;
    return `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} - ${addr.neighborhood}, ${addr.city}`;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 border-l-4 border-l-red-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-white">Pedido #{order.id.slice(-8)}</h3>
            <p className="text-sm text-orange-200">
              {new Date(order.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">
              {formatPrice(order.total)}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge className={order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {order.payment_status === 'paid' ? 'Pago' : 'Pendente'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-medium text-white">{order.customers?.name || 'Cliente não identificado'}</p>
            <p className="text-sm text-orange-200">{order.customers?.phone || 'Telefone não disponível'}</p>
            <p className="text-sm text-orange-200">{formatAddress()}</p>
          </div>
          <div>
            <p className="font-medium text-white">Itens:</p>
            <div className="text-sm text-orange-200">
              {order.order_items?.map((item, index) => (
                <div key={index}>
                  {item.quantity}x {item.products?.name || 'Item'} - {formatPrice(item.total_price)}
                </div>
              )) || <div>Itens não disponíveis</div>}
            </div>
            {order.notes && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">Obs: {order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {order.payment_status === 'pending' && order.payment_method === 'pix' && (
            <Button
              size="sm"
              onClick={() => onPaymentConfirm(order.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirmar Pagamento
            </Button>
          )}
          
          {order.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ChefHat className="h-4 w-4 mr-1" />
              Iniciar Preparo
            </Button>
          )}
          
          {order.status === 'preparing' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'ready')}
              className="bg-green-600 hover:bg-green-700"
            >
              Marcar como Pronto
            </Button>
          )}
          
          {order.status === 'ready' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'delivering')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Truck className="h-4 w-4 mr-1" />
              Saiu para Entrega
            </Button>
          )}
          
          {order.status === 'delivering' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'delivered')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Marcar como Entregue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffDashboard;
