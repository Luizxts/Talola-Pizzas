
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, ChefHat, Package, Truck, XCircle } from 'lucide-react';

interface OrderStatusProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pendente',
          className: 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white',
          iconColor: 'text-yellow-200'
        };
      case 'confirmed':
        return {
          icon: CheckCircle2,
          text: 'Confirmado',
          className: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white',
          iconColor: 'text-blue-200'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          text: 'Preparando',
          className: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white',
          iconColor: 'text-orange-200'
        };
      case 'ready':
        return {
          icon: Package,
          text: 'Pronto',
          className: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white',
          iconColor: 'text-purple-200'
        };
      case 'delivering':
        return {
          icon: Truck,
          text: 'Entregando',
          className: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white',
          iconColor: 'text-indigo-200'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Entregue',
          className: 'bg-gradient-to-r from-green-600 to-green-500 text-white',
          iconColor: 'text-green-200'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          text: 'Cancelado',
          className: 'bg-gradient-to-r from-red-600 to-red-500 text-white',
          iconColor: 'text-red-200'
        };
      default:
        return {
          icon: Clock,
          text: 'Desconhecido',
          className: 'bg-gradient-to-r from-gray-600 to-gray-500 text-white',
          iconColor: 'text-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} font-semibold shadow-lg backdrop-blur-sm border-0`}>
      <IconComponent className={`${iconSizes[size]} mr-1.5 ${config.iconColor}`} />
      {config.text}
    </Badge>
  );
};

export default OrderStatus;
