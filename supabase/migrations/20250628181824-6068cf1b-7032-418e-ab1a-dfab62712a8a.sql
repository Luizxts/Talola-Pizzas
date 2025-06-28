
-- Atualizar categorias existentes e adicionar novas
UPDATE categories SET name = 'Pizzas Salgadas', description = 'Nossas deliciosas pizzas salgadas tradicionais' WHERE name = 'Pizzas Salgadas';
UPDATE categories SET name = 'Pizzas Doces', description = 'Pizzas doces irresistíveis para sobremesa' WHERE name = 'Pizzas Doces';
UPDATE categories SET name = 'Combos e Promoções', description = 'Ofertas especiais e combos promocionais' WHERE name = 'Combos';

-- Remover categoria de bebidas
DELETE FROM product_options WHERE product_id IN (SELECT id FROM products WHERE category_id IN (SELECT id FROM categories WHERE name = 'Bebidas'));
DELETE FROM products WHERE category_id IN (SELECT id FROM categories WHERE name = 'Bebidas');
DELETE FROM categories WHERE name = 'Bebidas';

-- Adicionar novos produtos com mais variedade
DELETE FROM product_options;
DELETE FROM products;

-- Inserir produtos de pizzas salgadas
INSERT INTO products (category_id, name, description, base_price, preparation_time, image_url) VALUES
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Margherita', 'Molho de tomate, mussarela, manjericão fresco, azeite extra virgem', 35.00, 25, 'placeholder-pizza-margherita.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Calabresa', 'Molho de tomate, mussarela, calabresa artesanal, cebola roxa, azeituna preta', 38.00, 25, 'placeholder-pizza-calabresa.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Portuguesa', 'Molho de tomate, mussarela, presunto, ovos, cebola, pimentão, azeituna', 42.00, 30, 'placeholder-pizza-portuguesa.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Pepperoni', 'Molho de tomate, mussarela, pepperoni premium, orégano', 40.00, 25, 'placeholder-pizza-pepperoni.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Quatro Queijos', 'Molho branco, mussarela, gorgonzola, parmesão, provolone', 45.00, 30, 'placeholder-pizza-4queijos.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Salgadas'), 'Pizza Frango Catupiry', 'Molho de tomate, mussarela, frango desfiado, catupiry original', 43.00, 30, 'placeholder-pizza-frango.jpg');

-- Inserir produtos de pizzas doces
INSERT INTO products (category_id, name, description, base_price, preparation_time, image_url) VALUES
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Chocolate', 'Chocolate ao leite derretido, morango fresco, granulado colorido', 30.00, 20, 'placeholder-pizza-chocolate.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Banana Canela', 'Banana fatiada, canela em pó, açúcar cristal, leite condensado', 28.00, 20, 'placeholder-pizza-banana.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Romeu e Julieta', 'Queijo minas, goiabada cremosa, açúcar cristal', 32.00, 22, 'placeholder-pizza-romeu.jpg'),
((SELECT id FROM categories WHERE name = 'Pizzas Doces'), 'Pizza Prestígio', 'Chocolate ao leite, coco ralado, leite condensado', 35.00, 22, 'placeholder-pizza-prestigio.jpg');

-- Inserir combos e promoções
INSERT INTO products (category_id, name, description, base_price, preparation_time, image_url) VALUES
((SELECT id FROM categories WHERE name = 'Combos e Promoções'), 'Combo Família', '2 Pizzas Grandes (Salgadas) + Refrigerante 2L', 85.00, 35, 'placeholder-combo-familia.jpg'),
((SELECT id FROM categories WHERE name = 'Combos e Promoções'), 'Combo Casal', '1 Pizza Grande + 1 Pizza Doce Média', 65.00, 30, 'placeholder-combo-casal.jpg'),
((SELECT id FROM categories WHERE name = 'Combos e Promoções'), 'Promoção Estudante', 'Pizza Média Salgada + Refrigerante Lata', 32.00, 25, 'placeholder-promo-estudante.jpg'),
((SELECT id FROM categories WHERE name = 'Combos e Promoções'), 'Super Combo', '3 Pizzas Grandes + 2 Refrigerantes 2L', 120.00, 40, 'placeholder-super-combo.jpg');

-- Inserir opções de tamanho para todas as pizzas (exceto combos)
INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required) 
SELECT id, 'Pequena (25cm)', 'size', -12.00, true FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Pizzas Salgadas', 'Pizzas Doces'));

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required) 
SELECT id, 'Média (30cm)', 'size', 0.00, true FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Pizzas Salgadas', 'Pizzas Doces'));

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required) 
SELECT id, 'Grande (35cm)', 'size', 18.00, true FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Pizzas Salgadas', 'Pizzas Doces'));

-- Adicionar opções de recheios extras (apenas para pizzas salgadas)
INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Mussarela', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Calabresa', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Frango', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Catupiry', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Bacon', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

INSERT INTO product_options (product_id, name, option_type, price_modifier, is_required, max_selections) 
SELECT id, 'Extra Pepperoni', 'extra', 3.00, false, 10 FROM products WHERE category_id = (SELECT id FROM categories WHERE name = 'Pizzas Salgadas');

-- Criar tabela para modificações de pedidos
CREATE TABLE IF NOT EXISTS order_modifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  modification_type TEXT NOT NULL, -- 'add_extra', 'remove_ingredient'
  ingredient_name TEXT NOT NULL,
  price_change DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE order_modifications ENABLE ROW LEVEL SECURITY;

-- Política para modificações de pedidos
CREATE POLICY "Staff can manage order modifications" ON order_modifications FOR ALL USING (true);
