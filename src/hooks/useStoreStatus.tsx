
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
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar status da loja:', error);
        return;
      }

      if (data) {
        setStoreStatus(data as StoreStatus);
      } else {
        // Se não existe configuração, criar uma padrão (fechada por segurança)
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
          console.error('Erro ao criar configuração padrão:', insertError);
          return;
        }
        setStoreStatus(newData as StoreStatus);
      }
    } catch (error) {
      console.error('Erro ao buscar status da loja:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreStatus = async (updatedBy: string = 'Staff') => {
    if (!storeStatus) return;

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
      toast.success(`Loja ${newStatus ? 'aberta' : 'fechada'} com sucesso!`, {
        description: `Status alterado por: ${updatedBy}`,
        duration: 3000,
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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkStoreInteraction = () => {
    if (!storeStatus?.is_open) {
      toast.error('Loja fechada! Entre em contato pelo WhatsApp (21) 97540-6476', {
        description: 'Funcionamos das 18:00 às 00:00',
        duration: 5000,
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
