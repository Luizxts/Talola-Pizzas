
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, ChefHat, Truck, Package } from 'lucide-react';

interface OrderStatusProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pedido Recebido',
          color: 'bg-yellow-500 text-white',
          description: 'Aguardando confirmação'
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          text: 'Confirmado',
          color: 'bg-blue-500 text-white',
          description: 'Pedido confirmado, iniciando preparo'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'Preparando',
          color: 'bg-orange-500 text-white',
          description: 'Sua pizza está sendo preparada'
        };
      case 'ready':
        return {
          icon: Package,
          text: 'Pronto',
          color: 'bg-purple-500 text-white',
          description: 'Pedido pronto, saindo para entrega'
        };
      case 'delivering':
        return {
          icon: Truck,
          text: 'Saindo para Entrega',
          color: 'bg-indigo-500 text-white',
          description: 'A caminho do seu endereço'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Entregue',
          color: 'bg-green-500 text-white',
          description: 'Pedido entregue com sucesso'
        };
      default:
        return {
          icon: Clock,
          text: 'Processando',
          color: 'bg-gray-500 text-white',
          description: 'Verificando status'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center gap-1`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.text}
    </Badge>
  );
};

export default OrderStatus;
