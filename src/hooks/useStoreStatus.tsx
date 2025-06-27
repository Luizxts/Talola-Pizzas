
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreStatus {
  id: string;
  is_open: boolean;
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
        throw error;
      }

      if (data) {
        setStoreStatus(data as StoreStatus);
      } else {
        // Se não existe configuração, criar uma padrão (aberta)
        const defaultStatus = {
          is_open: true,
          last_updated: new Date().toISOString(),
          updated_by: 'Sistema'
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('store_settings')
          .insert(defaultStatus)
          .select()
          .single();

        if (insertError) throw insertError;
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
      toast.success(`Loja ${newStatus ? 'aberta' : 'fechada'} com sucesso!`);
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
      toast.error('Loja fechada! Entre em contato pelo WhatsApp (21) 97540-6476');
      return false;
    }
    return true;
  };

  return {
    storeStatus,
    loading,
    toggleStoreStatus,
    checkStoreInteraction,
    isOpen: storeStatus?.is_open ?? false
  };
};
