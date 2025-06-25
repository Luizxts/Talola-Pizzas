
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  options?: Array<{
    id: string;
    name: string;
    priceModifier: number;
  }>;
  onAddToCart: (item: any) => void;
}

const MenuCard: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  basePrice,
  imageUrl,
  options = [],
  onAddToCart
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, any>>({});
  const [quantity, setQuantity] = React.useState(1);

  const calculatePrice = () => {
    let price = basePrice;
    Object.values(selectedOptions).forEach((option: any) => {
      if (option) price += option.priceModifier;
    });
    return price * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart({
      id,
      name,
      description,
      basePrice,
      selectedOptions,
      quantity,
      totalPrice: calculatePrice()
    });
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <CardHeader className="flex-1">
        <CardTitle className="text-lg text-gray-800">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-red-100 text-red-800 text-sm">
            A partir de {formatPrice(basePrice)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Options */}
        {options.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Opções:</h4>
            {options.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`option-${id}`}
                  value={option.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOptions(prev => ({
                        ...prev,
                        [id]: option
                      }));
                    }
                  }}
                  className="text-red-600"
                />
                <span className="text-sm text-gray-700">
                  {option.name} 
                  {option.priceModifier > 0 && (
                    <span className="text-green-600 font-medium">
                      {' '}(+{formatPrice(option.priceModifier)})
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Quantidade:</span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">
              Total: {formatPrice(calculatePrice())}
            </span>
            <Button 
              onClick={handleAddToCart}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
