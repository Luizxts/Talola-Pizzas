
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface MenuItemOption {
  id: string;
  name: string;
  priceModifier: number;
  optionType: string;
  isRequired: boolean;
  maxSelections?: number;
}

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  options?: MenuItemOption[];
  onAddToCart: (item: any) => void;
  isStoreOpen: boolean;
}

const MenuCard: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  basePrice,
  imageUrl,
  options = [],
  onAddToCart,
  isStoreOpen
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = options.filter(opt => opt.optionType === 'size');
  const extraOptions = options.filter(opt => opt.optionType === 'extra');
  const isCombo = name.includes('Combo') || name.includes('Promoção');

  const calculatePrice = () => {
    let price = basePrice;
    
    // Adicionar modificadores de preço das opções selecionadas
    Object.values(selectedOptions).forEach((option: any) => {
      if (Array.isArray(option)) {
        // Para extras (múltipla seleção)
        option.forEach((opt: any) => {
          if (opt) price += opt.priceModifier;
        });
      } else if (option) {
        // Para tamanho (seleção única)
        price += option.priceModifier;
      }
    });
    
    return price * quantity;
  };

  const handleSizeChange = (optionId: string) => {
    const selectedOption = sizeOptions.find(opt => opt.id === optionId);
    setSelectedOptions(prev => ({
      ...prev,
      size: selectedOption
    }));
  };

  const handleExtraChange = (optionId: string, checked: boolean) => {
    const selectedOption = extraOptions.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    setSelectedOptions(prev => {
      const currentExtras = prev.extras || [];
      if (checked) {
        return {
          ...prev,
          extras: [...currentExtras, selectedOption]
        };
      } else {
        return {
          ...prev,
          extras: currentExtras.filter((opt: any) => opt.id !== optionId)
        };
      }
    });
  };

  const handleAddToCart = () => {
    // Validar se opções obrigatórias foram selecionadas
    const requiredOptions = options.filter(opt => opt.isRequired);
    const missingRequired = requiredOptions.some(opt => {
      if (opt.optionType === 'size') {
        return !selectedOptions.size;
      }
      return false;
    });

    if (missingRequired && !isCombo) {
      alert('Por favor, selecione todas as opções obrigatórias');
      return;
    }

    const itemName = selectedOptions.size ? 
      `${name} (${selectedOptions.size.name})` : name;

    const extrasText = selectedOptions.extras?.length > 0 ? 
      ` + ${selectedOptions.extras.map((e: any) => e.name).join(', ')}` : '';

    onAddToCart({
      id,
      name: itemName + extrasText,
      basePrice: calculatePrice() / quantity,
      selectedOptions,
      quantity,
      totalPrice: calculatePrice()
    });

    // Reset form
    setSelectedOptions({});
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const canAddToCart = () => {
    if (!isStoreOpen) return false;
    if (isCombo) return true;
    
    const requiredOptions = options.filter(opt => opt.isRequired);
    return requiredOptions.every(opt => {
      if (opt.optionType === 'size') {
        return selectedOptions.size;
      }
      return true;
    });
  };

  return (
    <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow ${!isStoreOpen ? 'opacity-75' : ''}`}>
      {imageUrl && (
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          <img 
            src={`/placeholder-images/${imageUrl}`} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      
      <CardHeader className="flex-1">
        <CardTitle className="text-lg text-white">{name}</CardTitle>
        <CardDescription className="text-sm text-orange-200">{description}</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-green-100 text-green-800 text-sm">
            {formatPrice(basePrice)}
          </Badge>
          {isCombo && (
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              OFERTA ESPECIAL
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opções de Tamanho */}
        {sizeOptions.length > 0 && !isCombo && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-white">Tamanho:</h4>
            <RadioGroup value={selectedOptions.size?.id || ''} onValueChange={handleSizeChange}>
              {sizeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-sm text-orange-200 cursor-pointer">
                    {option.name}
                    {option.priceModifier !== 0 && (
                      <span className={`font-medium ml-1 ${option.priceModifier > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {option.priceModifier > 0 ? '+' : ''}{formatPrice(option.priceModifier)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Extras */}
        {extraOptions.length > 0 && !isCombo && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-white">Extras (+R$ 3,00 cada):</h4>
            {extraOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.extras?.some((e: any) => e.id === option.id) || false}
                  onCheckedChange={(checked) => handleExtraChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id} className="text-sm text-orange-200 cursor-pointer">
                  {option.name}
                  <span className="text-red-400 font-medium ml-1">
                    +{formatPrice(option.priceModifier)}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Quantidade */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Quantidade:</span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || !isStoreOpen}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-center min-w-[3rem] text-white font-bold">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!isStoreOpen}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Total e Botão */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">
              Total: {formatPrice(calculatePrice())}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={!canAddToCart()}
            className={`w-full ${isStoreOpen && canAddToCart() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
          >
            {isStoreOpen ? 'Adicionar ao Carrinho' : 'Loja Fechada'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
