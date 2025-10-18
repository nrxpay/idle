import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SpinWheelConfig {
  title: string;
  body_text: string;
}

export const useSpinWheelConfig = () => {
  const [config, setConfig] = useState<SpinWheelConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('spin_wheel_config')
        .select('title, body_text')
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

            setConfig(data || {
        title: '🪔 Diwali Dhamaka Spin Wheel 🪔',
        body_text: 'May this Diwali bring you prosperity and mega bonuses!'
      });
    } catch (error) {
      console.error('Error fetching spin wheel config:', error);
            setConfig({
        title: '🪔 Diwali Dhamaka Spin Wheel 🪔',
        body_text: 'May this Diwali bring you prosperity and mega bonuses!'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();

    // Subscribe to config changes
    const subscription = supabase
      .channel('spin_wheel_config_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'spin_wheel_config' },
        () => {
          fetchConfig();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { config, loading, refetch: fetchConfig };
};
