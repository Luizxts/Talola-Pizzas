import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  LogOut, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Store
} from 'lucide-react';
import { toast } from 'sonner';
import { useStoreStatus } from '@/hooks/useStoreStatus';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: { name: string; quantity: number; }[];
  total_amount: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  pending: number;
  preparing: number;
  ready: number;
  delivering: number;
  completed: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
}

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { storeStatus, toggleStoreStatus, isOpen } = useStoreStatus();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pending: 0,
    preparing: 0,
    ready: 0,
    delivering: 0,
    completed: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('staff_logged_in');
    if (!isLoggedIn) {
      navigate('/staff-login');
    } else {
      fetchOrders(selectedPeriod);
      fetchStats();
    }
  }, [navigate, selectedPeriod]);

  const fetchOrders = async (period: string) => {
    setLoading(true);
    try {
      let startDate = new Date();
      let endDate = new Date();

      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === 'week') {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === 'month') {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total,
          status,
          customers (
            name,
            phone
          ),
          delivery_addresses (
            street,
            number,
            complement,
            neighborhood,
            city
          ),
          order_items (
            quantity,
            products (
              name
            )
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const formattedOrders = data.map(order => ({
        id: order.id,
        created_at: order.created_at,
        total_amount: order.total,
        status: order.status,
        customer_name: order.customers?.name || 'N/A',
        customer_phone: order.customers?.phone || 'N/A',
        customer_address: `${order.delivery_addresses?.street || 'N/A'}, ${order.delivery_addresses?.number || 'N/A'}, ${order.delivery_addresses?.neighborhood || 'N/A'}`,
        items: order.order_items?.map(item => ({
          name: item.products?.name || 'N/A',
          quantity: item.quantity
        })) || []
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao buscar pedidos');
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

      if (error) throw error;

      setStats(data);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      toast.error('Erro ao buscar estatísticas');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Status do pedido atualizado!');
      fetchStats();
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price?.toFixed(2).replace('.', ',')}`;
  };

  const handleStoreToggle = async () => {
    await toggleStoreStatus('Staff Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('staff_logged_in');
    navigate('/staff-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl">Carregando painel...</p>
        </div>
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
                <h1 className="text-2xl font-bold text-white">PAINEL ADMINISTRATIVO</h1>
                <p className="text-orange-300 text-sm">Gestão de pedidos e estatísticas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Controle da Loja */}
              <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-3">
                <Store className="h-5 w-5 text-white" />
                <Label htmlFor="store-status" className="text-white font-medium">
                  Status da Loja
                </Label>
                <Switch
                  id="store-status"
                  checked={isOpen}
                  onCheckedChange={handleStoreToggle}
                />
                <span className={`font-bold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {isOpen ? 'ABERTA' : 'FECHADA'}
                </span>
              </div>
              
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-blue-200 text-sm">Pendentes</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600/20 backdrop-blur-sm border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.preparing}</p>
              <p className="text-yellow-200 text-sm">Preparando</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-600/20 backdrop-blur-sm border-orange-400/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.ready}</p>
              <p className="text-orange-200 text-sm">Prontos</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600/20 backdrop-blur-sm border-purple-400/30">
            <CardContent className="p-4 text-center">
              <Truck className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.delivering}</p>
              <p className="text-purple-200 text-sm">Entregando</p>
            </CardContent>
          </Card>

          <Card className="bg-green-600/20 backdrop-blur-sm border-green-400/30">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-green-200 text-sm">Entregues</p>
            </CardContent>
          </Card>

          <Card className="bg-red-600/20 backdrop-blur-sm border-red-400/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{formatPrice(stats.todayRevenue)}</p>
              <p className="text-red-200 text-sm">Hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-600/20 backdrop-blur-sm border-emerald-400/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{formatPrice(stats.monthRevenue)}</p>
              <p className="text-emerald-200 text-sm">Mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-6 w-6" />
                Pedidos
              </CardTitle>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Semana</SelectItem>
                      <SelectItem value="month">Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Badge className="bg-white/20 text-white">
                  {orders.length} pedidos
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">ID</th>
                    <th className="py-2">Data</th>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Endereço</th>
                    <th className="py-2">Itens</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-white/20">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3">{order.customer_name}</td>
                      <td className="py-3">{order.customer_address}</td>
                      <td className="py-3">
                        {order.items.map(item => (
                          <div key={item.name}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-3">{formatPrice(order.total_amount)}</td>
                      <td className="py-3">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="preparing">Preparando</SelectItem>
                            <SelectItem value="ready">Pronto</SelectItem>
                            <SelectItem value="delivering">Entregando</SelectItem>
                            <SelectItem value="completed">Entregue</SelectItem>
                            <SelectItem value="canceled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3">
                        {/* Add any actions here if needed */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
