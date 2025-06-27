
-- Create store_settings table for managing store open/close status
CREATE TABLE public.store_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_open boolean NOT NULL DEFAULT true,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT 'Sistema',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default store settings
INSERT INTO public.store_settings (is_open, updated_by) 
VALUES (true, 'Sistema');

-- Create dashboard_stats view for staff dashboard statistics
CREATE VIEW public.dashboard_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'preparing') as preparing,
  COUNT(*) FILTER (WHERE status = 'ready') as ready,
  COUNT(*) FILTER (WHERE status = 'delivering') as delivering,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as todayRevenue,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) >= DATE_TRUNC('month', CURRENT_DATE)), 0) as monthRevenue,
  COALESCE(SUM(total) FILTER (WHERE DATE(created_at) >= DATE_TRUNC('year', CURRENT_DATE)), 0) as yearRevenue
FROM public.orders;
