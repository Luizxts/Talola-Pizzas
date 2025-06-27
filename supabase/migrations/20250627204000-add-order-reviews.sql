
-- Criar tabela para avaliações dos pedidos
CREATE TABLE public.order_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar índices para performance
CREATE INDEX idx_order_reviews_order_id ON public.order_reviews(order_id);
CREATE INDEX idx_order_reviews_customer_id ON public.order_reviews(customer_id);
CREATE INDEX idx_order_reviews_rating ON public.order_reviews(rating);

-- Adicionar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_order_reviews_updated_at 
    BEFORE UPDATE ON public.order_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Atualizar a view dashboard_stats para incluir avaliações
DROP VIEW IF EXISTS public.dashboard_stats;
CREATE VIEW public.dashboard_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'preparing') as preparing,
  COUNT(*) FILTER (WHERE status = 'ready') as ready,
  COUNT(*) FILTER (WHERE status = 'delivering') as delivering,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as todayRevenue,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) >= DATE_TRUNC('month', CURRENT_DATE)), 0) as monthRevenue,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) >= DATE_TRUNC('year', CURRENT_DATE)), 0) as yearRevenue,
  COALESCE(AVG((SELECT rating FROM public.order_reviews WHERE order_reviews.order_id = orders.id)), 0) as avgRating,
  COUNT((SELECT 1 FROM public.order_reviews WHERE order_reviews.order_id = orders.id)) as totalReviews
FROM public.orders;
