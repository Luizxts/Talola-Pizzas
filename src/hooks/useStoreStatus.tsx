
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
      console.log('Buscando configuração da loja...');
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar status da loja:', error);
        toast.error('Erro ao carregar status da loja');
        return;
      }

      if (data) {
        console.log('Configuração encontrada:', data);
        setStoreStatus(data as StoreStatus);
      } else {
        console.log('Nenhuma configuração encontrada, criando uma nova...');
        // Se não existe configuração, criar uma nova
        const defaultStatus = {
          is_open: false,
          opening_time: '18:00',
          closing_time: '00:00',
          last_updated: new Date().toISOString(),
          updated_by: 'Sistema'
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('store_settings')
          .insert(defaultStatus)
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao criar configuração da loja:', insertError);
          toast.error('Erro ao inicializar configuração da loja');
        } else {
          console.log('Nova configuração criada:', newData);
          setStoreStatus(newData as StoreStatus);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar status da loja:', error);
      toast.error('Erro ao carregar status da loja');
    } finally {
      setLoading(false);
    }
  };

  const checkAutoClose = () => {
    if (!storeStatus || !storeStatus.closing_time) return;

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
    console.log('Tentando alterar status da loja...', { storeStatus, updatedBy });
    
    if (!storeStatus) {
      console.error('Store status não encontrado');
      toast.error('Erro: Status da loja não encontrado');
      return;
    }

    if (!storeStatus.id) {
      console.error('Store status sem ID válido');
      toast.error('Erro: Configuração da loja inválida');
      return;
    }

    // Verificar se o ID é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(storeStatus.id)) {
      console.error('ID inválido detectado:', storeStatus.id);
      toast.error('Erro: ID da configuração inválido. Recarregando...');
      // Recarregar a configuração
      await fetchStoreStatus();
      return;
    }

    const newStatus = !storeStatus.is_open;
    console.log('Novo status:', newStatus);
    
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

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao alterar status da loja: ' + error.message);
        return;
      }

      console.log('Status atualizado com sucesso:', data);
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
