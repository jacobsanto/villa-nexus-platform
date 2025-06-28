
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

export const useStockLocations = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { tenant } = useTenant();

  const fetchLocations = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('stock_levels')
        .select('location')
        .eq('tenant_id', tenant.id)
        .order('location');

      if (error) throw error;

      const uniqueLocations: string[] = [...new Set((data || []).map((item: any) => item.location))].filter(Boolean);
      setLocations(uniqueLocations);
      
      if (uniqueLocations.length > 0 && !selectedLocation) {
        setSelectedLocation(uniqueLocations[0]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [tenant]);

  return {
    locations,
    selectedLocation,
    setSelectedLocation
  };
};
