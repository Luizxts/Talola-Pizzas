
-- Create categories table for organizing menu items
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table for menu items
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL,
  image_url TEXT,
  preparation_time INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product options table for pizza sizes, burger variations, etc.
CREATE TABLE public.product_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  name TEXT NOT NULL,
  option_type TEXT NOT NULL, -- 'size', 'variant', 'addon'
  price_modifier NUMERIC DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  max_selections INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create delivery addresses table
CREATE TABLE public.delivery_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'São Paulo',
  zip_code TEXT,
  reference TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  delivery_address_id UUID REFERENCES public.delivery_addresses(id),
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'pix', 'card', 'cash'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'
  notes TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  customizations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed'
  discount_value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample categories
INSERT INTO public.categories (name, description, display_order) VALUES
('Pizzas Doces', 'Pizzas doces deliciosas', 1),
('Burgers', 'Hambúrgueres artesanais', 2),
('Petiscos', 'Petiscos para acompanhar', 3),
('Açaí', 'Açaí cremoso com acompanhamentos', 4),
('Combos', 'Combos especiais', 5);

-- Insert sample products based on the menu images
INSERT INTO public.products (category_id, name, description, base_price, display_order) VALUES
-- Pizzas Doces
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Banana', 'Creme de leite, mussarela, banana, canela e açúcar', 30.00, 1),
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Banana com Chocolate', 'Creme de leite, mussarela, banana, chocolate', 30.00, 2),
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Chocobool', 'Creme de leite, mussarela, chocolate e bolinha de chocobool', 30.00, 3),
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Confete', 'Creme de leite, mussarela, chocolate e confete', 30.00, 4),
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Prestígio', 'Creme de leite, mussarela, chocolate, leite condensado e coco ralado', 30.00, 5),
((SELECT id FROM public.categories WHERE name = 'Pizzas Doces'), 'Romeu e Julieta', 'Creme de leite, mussarela, goiabada em calda e catupiry', 30.00, 6),

-- Burgers
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'Hambúrguer', 'Pão, carne, molho especial e salada', 6.00, 1),
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'X-Burguer', 'Pão, carne, queijo, molho especial e salada', 7.00, 2),
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'X-Egg', 'Pão, carne, queijo, ovo, molho especial e salada', 8.00, 3),
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'X-Bacon', 'Pão, carne, queijo, bacon, molho especial e salada', 10.00, 4),
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'X-Calabresa', 'Pão, carne, queijo, calabresa, molho especial e salada', 10.00, 5),
((SELECT id FROM public.categories WHERE name = 'Burgers'), 'X-Tudo', 'Pão, carne, queijo, ovo, bacon, calabresa, molho especial e salada', 12.00, 6),

-- Petiscos
((SELECT id FROM public.categories WHERE name = 'Petiscos'), 'Calabresa com Fritas', 'Porção de calabresa com batata frita', 30.00, 1),
((SELECT id FROM public.categories WHERE name = 'Petiscos'), 'Batata Frita', 'Porção de batata frita crocante', 20.00, 2),
((SELECT id FROM public.categories WHERE name = 'Petiscos'), 'Batata Frita com Cheddar e Bacon', 'Batata frita com cheddar e bacon', 30.00, 3),
((SELECT id FROM public.categories WHERE name = 'Petiscos'), 'Anéis de Cebola', 'Anéis de cebola empanados e fritos', 12.00, 4),
((SELECT id FROM public.categories WHERE name = 'Petiscos'), 'Nugguet', 'Nuggets de frango crocantes', 12.00, 5),

-- Açaí
((SELECT id FROM public.categories WHERE name = 'Açaí'), 'Açaí 250ml', 'Açaí cremoso de 250ml', 6.00, 1),
((SELECT id FROM public.categories WHERE name = 'Açaí'), 'Açaí 300ml', 'Açaí cremoso de 300ml', 7.00, 2),
((SELECT id FROM public.categories WHERE name = 'Açaí'), 'Açaí 400ml', 'Açaí cremoso de 400ml', 8.00, 3),
((SELECT id FROM public.categories WHERE name = 'Açaí'), 'Açaí 500ml', 'Açaí cremoso de 500ml', 9.00, 4),
((SELECT id FROM public.categories WHERE name = 'Açaí'), 'Açaí 770ml', 'Açaí cremoso de 770ml', 12.00, 5);

-- Insert product options for pizza sizes
INSERT INTO public.product_options (product_id, name, option_type, price_modifier) 
SELECT p.id, 'Média (35cm)', 'size', 5.00 FROM public.products p JOIN public.categories c ON p.category_id = c.id WHERE c.name = 'Pizzas Doces';

INSERT INTO public.product_options (product_id, name, option_type, price_modifier) 
SELECT p.id, 'Grande (47cm)', 'size', 17.00 FROM public.products p JOIN public.categories c ON p.category_id = c.id WHERE c.name = 'Pizzas Doces';

INSERT INTO public.product_options (product_id, name, option_type, price_modifier) 
SELECT p.id, 'Gigante (60cm)', 'size', 50.00 FROM public.products p JOIN public.categories c ON p.category_id = c.id WHERE c.name = 'Pizzas Doces';

-- Insert burger variations
INSERT INTO public.product_options (product_id, name, option_type, price_modifier) 
SELECT p.id, 'Picanha', 'variant', 2.00 FROM public.products p JOIN public.categories c ON p.category_id = c.id WHERE c.name = 'Burgers';

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
