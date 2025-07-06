
-- Habilitar RLS na tabela store_settings se não estiver habilitado
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura de qualquer usuário
CREATE POLICY "Anyone can read store settings" 
ON public.store_settings 
FOR SELECT 
USING (true);

-- Criar política para permitir criação da configuração inicial
CREATE POLICY "Allow insert store settings" 
ON public.store_settings 
FOR INSERT 
WITH CHECK (true);

-- Criar política para permitir atualizações na configuração
CREATE POLICY "Allow update store settings" 
ON public.store_settings 
FOR UPDATE 
USING (true);
