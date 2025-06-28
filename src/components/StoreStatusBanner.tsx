
import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { useStoreStatus } from '@/hooks/useStoreStatus';

const StoreStatusBanner = () => {
  const { storeStatus, isOpen, getFormattedHours } = useStoreStatus();

  if (!storeStatus) return null;

  if (isOpen) {
    return (
      <div className="bg-green-600 text-white py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">LOJA ABERTA</span>
          <span className="hidden md:inline">- Funcionamos das {getFormattedHours()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white py-3 px-4 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="font-bold text-lg">LOJA FECHADA</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4" />
          <span>Entre em contato: (21) 97540-6476</span>
        </div>
      </div>
    </div>
  );
};

export default StoreStatusBanner;
