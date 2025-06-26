
-- Limpar tabelas existentes e criar estrutura completa para pizzaria
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS delivery_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS product_options CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;

-- Criar tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  preparation_time INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de opções de produtos
CREATE TABLE product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  option_type TEXT NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  max_selections INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de endereços de entrega
CREATE TABLE delivery_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
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

-- Criar tabela de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  delivery_address_id UUID REFERENCES delivery_addresses(id),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de itens do pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customizations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de promoções
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir categorias iniciais
INSERT INTO categories (name, description, display_order) VALUES
('Pizzas Salgadas', 'Nossas deliciosas pizzas salgadas tradicionais', 1),
('Pizzas Doces', 'Pizzas doces irresistíveis para sobremesa', 2),
('Combos', 'Ofertas especiais e combos promocionais', 3),
('Bebidas', 'Refrigerantes, sucos e bebidas geladas', 4);

-- Inserir produtos de exemplo
INSERT INTO products (category_id, name, description, base_price, preparation_time) VALUES
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Margherita', 'Molho de tomate, mussarela, manjericão, azeitona', 35.00, 25),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Calabresa', 'Molho de tomate, mussarela, calabresa, cebola, azeituna', 38.00, 25),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Portuguesa', 'Molho de tomate, mussarela, presunto, ovos, cebola, azeituna', 42.00, 30),
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Chocolate', 'Chocolate ao leite, morango, granulado', 30.00, 20),
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Banana', 'Banana, canela, açúcar, leite condensado', 28.00, 20),
((SELECT id FROM categories WHERE name = 'Combos'), 'Combo Família', '2 Pizzas Grandes + 2 Refrigerantes 2L', 85.00, 35),
((SELECT id FROM categories WHERE name = 'Bebidas'), 'Coca-Cola 2L', 'Refrigerante Coca-Cola 2 litros', 8.00, 0),
((SELECT id FROM categories WHERE name = 'Bebidas'), 'Suco Natural 500ml', 'Suco natural de laranja, limão ou uva', 6.00, 5);

-- Inserir opções de produtos (tamanhos de pizza)
INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required) VALUES
((SELECT id FROM products WHERE name = 'Pizza Margherita'), 'Pequena', 'size', -10.00, true),
((SELECT id FROM products WHERE name = 'Pizza Margherita'), 'Média', 'size', 0.00, true),
((SELECT id FROM products WHERE name = 'Pizza Margherita'), 'Grande', 'size', 15.00, true),
((SELECT id FROM products WHERE name = 'Pizza Calabresa'), 'Pequena', 'size', -10.00, true),
((SELECT id FROM products WHERE name = 'Pizza Calabresa'), 'Média', 'size', 0.00, true),
((SELECT id FROM products WHERE name = 'Pizza Calabresa'), 'Grande', 'size', 15.00, true);

-- Habilitar RLS nas tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Criar políticas públicas para leitura do cardápio
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product options" ON product_options FOR SELECT USING (true);
CREATE POLICY "Anyone can view promotions" ON promotions FOR SELECT USING (is_active = true);

-- Staff pode fazer tudo nos pedidos
CREATE POLICY "Staff can manage orders" ON orders FOR ALL USING (true);
CREATE POLICY "Staff can manage order items" ON order_items FOR ALL USING (true);
CREATE POLICY "Staff can manage customers" ON customers FOR ALL USING (true);
CREATE POLICY "Staff can manage delivery addresses" ON delivery_addresses FOR ALL USING (true);

-- Funções para validar horário de funcionamento
CREATE OR REPLACE FUNCTION is_store_open()
RETURNS BOOLEAN AS $$
DECLARE
  current_hour INTEGER;
BEGIN
  current_hour := EXTRACT(HOUR FROM NOW() AT TIME ZONE 'America/Sao_Paulo');
  RETURN current_hour >= 18 OR current_hour < 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar pedidos apenas no horário de funcionamento
CREATE OR REPLACE FUNCTION validate_store_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_store_open() THEN
    RAISE EXCEPTION 'Loja fechada. Funcionamos das 18:00 às 00:00.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_store_hours_before_order
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_store_hours();
