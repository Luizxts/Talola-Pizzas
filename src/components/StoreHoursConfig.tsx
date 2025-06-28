
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

interface StoreHours {
  opening_time: string;
  closing_time: string;
}

const StoreHoursConfig = () => {
  const [hours, setHours] = useState<StoreHours>({ opening_time: '18:00', closing_time: '00:00' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStoreHours();
  }, []);

  const fetchStoreHours = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('opening_time, closing_time')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setHours({
          opening_time: data.opening_time || '18:00',
          closing_time: data.closing_time || '00:00'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          opening_time: hours.opening_time,
          closing_time: hours.closing_time,
          last_updated: new Date().toISOString(),
          updated_by: 'Funcionário'
        })
        .eq('id', (await supabase.from('store_settings').select('id').single()).data?.id);

      if (error) throw error;

      toast.success('Horários atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      toast.error('Erro ao salvar horários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Configurar Horários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-orange-200 text-sm mb-2 block">Horário de Abertura</label>
            <Input
              type="time"
              value={hours.opening_time}
              onChange={(e) => setHours({ ...hours, opening_time: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-orange-200 text-sm mb-2 block">Horário de Fechamento</label>
            <Input
              type="time"
              value={hours.closing_time}
              onChange={(e) => setHours({ ...hours, closing_time: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Horários'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreHoursConfig;
