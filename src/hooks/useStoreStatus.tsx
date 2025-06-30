
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreStatus {
  id: string;
  is_open: boolean;
  opening_time?: string;
  closing_time?: string;
  last_updated: string;
  updated_by: string;
  created_at: string;
}

export const useStoreStatus = () => {
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar status da loja:', error);
        // Fallback para loja fechada se houver erro
        setStoreStatus({
          id: 'default',
          is_open: false,
          opening_time: '18:00',
          closing_time: '00:00',
          last_updated: new Date().toISOString(),
          updated_by: 'Sistema',
          created_at: new Date().toISOString()
        });
        return;
      }

      if (data) {
        setStoreStatus(data as StoreStatus);
      } else {
        // Se não existe configuração, assumir loja fechada por segurança
        const defaultStatus = {
          id: 'default',
          is_open: false,
          opening_time: '18:00',
          closing_time: '00:00',
          last_updated: new Date().toISOString(),
          updated_by: 'Sistema',
          created_at: new Date().toISOString()
        };
        setStoreStatus(defaultStatus);
      }
    } catch (error) {
      console.error('Erro ao buscar status da loja:', error);
      // Fallback para loja fechada em caso de erro
      setStoreStatus({
        id: 'default',
        is_open: false,
        opening_time: '18:00',
        closing_time: '00:00',
        last_updated: new Date().toISOString(),
        updated_by: 'Sistema',
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAutoClose = () => {
    if (!storeStatus || !storeStatus.closing_time || storeStatus.id === 'default') return;

    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const closingTime = storeStatus.closing_time;

    // Se passou do horário de fechamento e a loja ainda está aberta
    if (currentTime >= closingTime && storeStatus.is_open) {
      // Fechar automaticamente
      toggleStoreStatus('Sistema - Fechamento Automático');
    }
  };

  const toggleStoreStatus = async (updatedBy: string = 'Staff') => {
    if (!storeStatus || storeStatus.id === 'default') return;

    const newStatus = !storeStatus.is_open;
    
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .update({
          is_open: newStatus,
          last_updated: new Date().toISOString(),
          updated_by: updatedBy
        })
        .eq('id', storeStatus.id)
        .select()
        .single();

      if (error) throw error;

      setStoreStatus(data as StoreStatus);
      
      const statusText = newStatus ? 'aberta' : 'fechada';
      const emoji = newStatus ? '🟢' : '🔴';
      const description = newStatus 
        ? 'Estamos prontos para receber pedidos!' 
        : 'Não receberemos novos pedidos no momento';
        
      toast.success(`${emoji} Loja ${statusText}!`, {
        description,
        duration: 4000,
      });
    } catch (error) {
      console.error('Erro ao alterar status da loja:', error);
      toast.error('Erro ao alterar status da loja');
    }
  };

  useEffect(() => {
    fetchStoreStatus();

    // Configurar real-time updates
    const channel = supabase
      .channel('store_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings'
        },
        (payload) => {
          console.log('Status da loja atualizado:', payload);
          if (payload.new) {
            setStoreStatus(payload.new as StoreStatus);
            
            // Notificação para todos os usuários quando o status muda
            const isOpen = (payload.new as any).is_open;
            if (payload.eventType === 'UPDATE') {
              const message = isOpen ? 
                '🟢 Loja agora está ABERTA!' : 
                '🔴 Loja agora está FECHADA!';
              const description = isOpen ?
                'Você já pode fazer pedidos online!' :
                'Pedidos serão aceitos quando reabrirmos';
                
              toast.info(message, {
                description,
                duration: 5000,
              });
            }
          }
        }
      )
      .subscribe();

    // Verificar fechamento automático a cada minuto
    const autoCloseInterval = setInterval(checkAutoClose, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(autoCloseInterval);
    };
  }, [storeStatus?.closing_time, storeStatus?.is_open]);

  const checkStoreInteraction = () => {
    if (!storeStatus?.is_open) {
      toast.error('🔴 Loja fechada!', {
        description: 'Entre em contato pelo WhatsApp: (21) 97540-6476',
        duration: 5000,
        action: {
          label: 'WhatsApp',
          onClick: () => window.open('https://wa.me/5521975406476', '_blank')
        }
      });
      return false;
    }
    return true;
  };

  const getFormattedHours = () => {
    if (!storeStatus) return 'Carregando...';
    const opening = storeStatus.opening_time || '18:00';
    const closing = storeStatus.closing_time || '00:00';
    return `${opening} - ${closing}`;
  };

  return {
    storeStatus,
    loading,
    toggleStoreStatus,
    checkStoreInteraction,
    getFormattedHours,
    isOpen: storeStatus?.is_open ?? false
  };
};
