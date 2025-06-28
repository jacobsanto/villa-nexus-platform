
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";

interface StockLevel {
  id: string;
  item_id: string;
  location: string;
  current_quantity: number;
  par_level?: number;
  item_name: string;
}

export const useStockLevels = (selectedLocation: string) => {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});
  const { tenant } = useTenant();
  const { toast } = useToast();

  const fetchStockLevels = async () => {
    if (!tenant?.id || !selectedLocation) return;

    try {
      const { data, error } = await (supabase as any)
        .from('stock_levels')
        .select(`
          *,
          inventory_items!inner(name)
        `)
        .eq('tenant_id', tenant.id)
        .eq('location', selectedLocation)
        .order('inventory_items.name');

      if (error) throw error;

      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        item_id: item.item_id,
        location: item.location,
        current_quantity: item.current_quantity,
        par_level: item.par_level,
        item_name: item.inventory_items.name
      }));

      setStockLevels(formattedData);
    } catch (error) {
      console.error('Error fetching stock levels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock levels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (stockLevelId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0;
    setPendingChanges(prev => ({
      ...prev,
      [stockLevelId]: quantity
    }));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      const updates = Object.entries(pendingChanges).map(([id, quantity]) => ({
        id,
        current_quantity: quantity
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('stock_levels')
          .update({ current_quantity: update.current_quantity })
          .eq('id', update.id);

        if (error) throw error;
      }

      // Update local state
      setStockLevels(prev => 
        prev.map(item => ({
          ...item,
          current_quantity: pendingChanges[item.id] ?? item.current_quantity
        }))
      );

      setPendingChanges({});
      setHasChanges(false);
      
      toast({
        title: "Success",
        description: "Stock levels updated successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchStockLevels();
    }
  }, [selectedLocation, tenant]);

  return {
    stockLevels,
    loading,
    hasChanges,
    pendingChanges,
    handleQuantityChange,
    saveChanges
  };
};
