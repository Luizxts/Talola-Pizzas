
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  LogOut,
  Bell,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderWithDetails {
  id: string;
  customer_id: string;
  delivery_address_id: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string;
  estimated_delivery_time: string;
  confirmed_at: string;
  delivered_at: string;
  created_at: string;
  updated_at: string;
  customers?: {
    name: string;
    phone: string;
  };
  delivery_addresses?: {
    street: string;
    number: string;
    complement: string;
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
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('staff_authenticated');
    if (!isAuthenticated) {
      navigate('/staff-login');
      return;
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
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

      const currentOrders = data || [];
      const previousOrderCount = orders.length;
      
      // Play sound for new orders
      if (currentOrders.length > previousOrderCount && previousOrderCount > 0) {
        playNotificationSound();
        toast.success('Novo pedido recebido!');
      }

      setOrders(currentOrders);
      calculateStats(currentOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const calculateStats = (orders: OrderWithDetails[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.created_at.startsWith(today)
    );
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => 
        order.status === 'pending' || order.status === 'preparing'
      ).length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
    };
    
    setStats(stats);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Status atualizado com sucesso!');
      fetchOrders();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const confirmPayment = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Pagamento confirmado!');
      fetchOrders();
    } catch (error) {
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
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-red-600">TALOLA - Dashboard</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bell className="h-3 w-3 mr-1" />
                {stats.pendingOrders} Pendentes
              </Badge>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faturamento Hoje</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {stats.todayRevenue.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="preparing">Preparando</TabsTrigger>
                <TabsTrigger value="ready">Prontos</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {orders.filter(order => order.status === 'pending').map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                    onPaymentConfirm={confirmPayment}
                  />
                ))}
              </TabsContent>

              <TabsContent value="preparing" className="space-y-4">
                {orders.filter(order => order.status === 'preparing').map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                    onPaymentConfirm={confirmPayment}
                  />
                ))}
              </TabsContent>

              <TabsContent value="ready" className="space-y-4">
                {orders.filter(order => order.status === 'ready').map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                    onPaymentConfirm={confirmPayment}
                  />
                ))}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {orders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                    onPaymentConfirm={confirmPayment}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ 
  order, 
  onStatusUpdate, 
  onPaymentConfirm 
}: { 
  order: OrderWithDetails; 
  onStatusUpdate: (id: string, status: string) => void;
  onPaymentConfirm: (id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = () => {
    if (!order.delivery_addresses) return 'Endereço não disponível';
    const addr = order.delivery_addresses;
    return `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} - ${addr.neighborhood}, ${addr.city}`;
  };

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">Pedido #{order.id.slice(-8)}</h3>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              R$ {order.total.toFixed(2).replace('.', ',')}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-medium">{order.customers?.name || 'Cliente não identificado'}</p>
            <p className="text-sm text-gray-600">{order.customers?.phone || 'Telefone não disponível'}</p>
            <p className="text-sm text-gray-600">{formatAddress()}</p>
          </div>
          <div>
            <p className="font-medium">Itens:</p>
            <div className="text-sm text-gray-600">
              {order.order_items?.map((item, index) => (
                <div key={index}>
                  {item.quantity}x {item.products?.name || 'Item'} - R$ {item.total_price.toFixed(2).replace('.', ',')}
                </div>
              )) || <div>Itens não disponíveis</div>}
            </div>
            {order.notes && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Obs: {order.notes}</p>
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
              className="bg-blue-600 hover:bg-blue-700"
            >
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
