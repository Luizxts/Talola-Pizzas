
import React from 'react';
import { Pizza } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg">
        T
      </div>
      <Pizza className="h-6 w-6 text-orange-500" />
      <span className="text-xl font-bold text-gray-800">TALOLA PIZZA</span>
    </div>
  );
};

export default Logo;
