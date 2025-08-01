import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Star, Clock } from 'lucide-react';

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
  preparationTime?: number;
}

const MenuCard: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  basePrice,
  imageUrl,
  options = [],
  onAddToCart,
  isStoreOpen,
  preparationTime = 20
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = options.filter(opt => opt.optionType === 'size');
  const isCombo = name.includes('Combo') || name.includes('Promoção');

  // Função para obter imagem baseada no nome do produto
  const getProductImage = () => {
    if (imageUrl) return imageUrl;
    
    const productName = name.toLowerCase();
    
    // URLs diretas de imagens de pizza do Unsplash
    if (productName.includes('margherita') || productName.includes('margarita') || 
        productName.includes('mussarela') || productName.includes('mozzarella') ||
        productName.includes('queijo') || productName.includes('tradicional')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop';
    } else if (productName.includes('calabresa') || productName.includes('pepperoni') || 
               productName.includes('linguiça') || productName.includes('salame')) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop';
    } else if (productName.includes('portuguesa') || productName.includes('supreme') ||
               productName.includes('palmito') || productName.includes('azeitona')) {
      return 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop';
    } else if (productName.includes('frango') || productName.includes('chicken') ||
               productName.includes('catupiry') || productName.includes('catupiri')) {
      return 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&h=600&fit=crop';
    } else if (productName.includes('quatro queijos') || productName.includes('4 queijos') ||
               productName.includes('gorgonzola') || productName.includes('cheese')) {
      return 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&h=600&fit=crop';
    } else if (productName.includes('bacon') || productName.includes('meat') ||
               productName.includes('lombo') || productName.includes('presunto')) {
      return 'https://images.unsplash.com/photo-1590534247854-3d44b90ec6d4?w=800&h=600&fit=crop';
    } else if (productName.includes('vegetariana') || productName.includes('veggie') ||
               productName.includes('verdura') || productName.includes('brócolis') ||
               productName.includes('tomate') || productName.includes('vegetais')) {
      return 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=800&h=600&fit=crop';
    } else if (productName.includes('napolitana') || productName.includes('italiana') ||
               productName.includes('caprese') || productName.includes('manjericão')) {
      return 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop';
    } else if (productName.includes('chocolate') || productName.includes('nutella') ||
               productName.includes('doce') || productName.includes('banana')) {
      return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop';
    } else if (productName.includes('combo') || productName.includes('promoção') ||
               productName.includes('especial') || productName.includes('oferta')) {
      return 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop';
    } else if (productName.includes('refrigerante') || productName.includes('coca') || 
               productName.includes('drink') || productName.includes('suco') ||
               productName.includes('bebida') || productName.includes('água')) {
      return 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=600&fit=crop';
    } else if (productName.includes('sobremesa') || productName.includes('brownie') ||
               productName.includes('pudim') || productName.includes('torta') ||
               productName.includes('bolo') || productName.includes('doce')) {
      return 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&h=600&fit=crop';
    } else if (productName.includes('pizza')) {
      // Para qualquer pizza que não foi identificada acima
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop';
    }
    
    // Imagem padrão genérica para qualquer produto
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop';
  };

  const calculatePrice = () => {
    let price = basePrice;
    
    if (selectedOptions.size) {
      price += selectedOptions.size.priceModifier;
    }
    
    return price * quantity;
  };

  const handleSizeChange = (optionId: string) => {
    const selectedOption = sizeOptions.find(opt => opt.id === optionId);
    setSelectedOptions(prev => ({
      ...prev,
      size: selectedOption
    }));
  };

  const handleAddToCart = () => {
    const requiredOptions = options.filter(opt => opt.isRequired);
    const missingRequired = requiredOptions.some(opt => {
      if (opt.optionType === 'size') {
        return !selectedOptions.size;
      }
      return false;
    });

    if (missingRequired && !isCombo) {
      alert('Por favor, selecione o tamanho da pizza');
      return;
    }

    const itemName = selectedOptions.size ? 
      `${name} (${selectedOptions.size.name})` : name;

    onAddToCart({
      id,
      name: itemName,
      basePrice: calculatePrice() / quantity,
      selectedOptions,
      quantity,
      totalPrice: calculatePrice()
    });

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
    <Card className={`group h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-slate-700/50 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 ${!isStoreOpen ? 'opacity-75' : ''}`}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        <img 
          src={getProductImage()} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop';
          }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-green-600/90 text-white text-lg font-bold px-3 py-1 backdrop-blur-sm">
            {formatPrice(basePrice)}
          </Badge>
        </div>

        {/* Special Offer Badge */}
        {isCombo && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 backdrop-blur-sm animate-pulse">
              <Star className="h-3 w-3 mr-1" />
              OFERTA ESPECIAL
            </Badge>
          </div>
        )}

        {/* Preparation Time */}
        <div className="absolute bottom-4 left-4 z-20">
          <Badge className="bg-black/60 text-orange-300 text-sm px-2 py-1 backdrop-blur-sm border border-orange-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {preparationTime} min
          </Badge>
        </div>
      </div>
      
      <CardHeader className="flex-1 pb-4">
        <CardTitle className="text-xl text-white font-bold leading-tight group-hover:text-orange-300 transition-colors">
          {name}
        </CardTitle>
        <CardDescription className="text-slate-300 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Size Options */}
        {sizeOptions.length > 0 && !isCombo && (
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Escolha o tamanho:
            </h4>
            <RadioGroup value={selectedOptions.size?.id || ''} onValueChange={handleSizeChange}>
              <div className="space-y-2">
                {sizeOptions.map((option) => (
                  <div key={option.id} className="group/option">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-700/50 hover:border-orange-500/30">
                      <RadioGroupItem value={option.id} id={option.id} className="border-orange-400 text-orange-400" />
                      <Label htmlFor={option.id} className="text-slate-200 cursor-pointer flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.name}</span>
                          <span className={`font-bold text-lg ${option.priceModifier > 0 ? 'text-red-400' : option.priceModifier < 0 ? 'text-green-400' : 'text-orange-300'}`}>
                            {option.priceModifier === 0 ? formatPrice(basePrice) : `${option.priceModifier > 0 ? '+' : ''}${formatPrice(basePrice + option.priceModifier)}`}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <span className="text-white font-semibold">Quantidade:</span>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || !isStoreOpen}
              className="h-10 w-10 p-0 border-orange-400/50 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="min-w-[3rem] text-center">
              <span className="text-2xl font-bold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-600">
                {quantity}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!isStoreOpen}
              className="h-10 w-10 p-0 border-orange-400/50 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* Total and Add Button */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-600/50">
            <span className="text-lg font-bold text-white">Total:</span>
            <span className="text-2xl font-bold text-green-400">
              {formatPrice(calculatePrice())}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={!canAddToCart()}
            className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
              isStoreOpen && canAddToCart() 
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:scale-[1.02]' 
                : 'bg-slate-700 cursor-not-allowed text-slate-400'
            }`}
            size="lg"
          >
            {isStoreOpen ? (
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar ao Carrinho
              </div>
            ) : (
              'Loja Fechada'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
