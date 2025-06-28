
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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

const StockLevelsView = () => {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});
  const { tenant } = useTenant();
  const { toast } = useToast();

  const fetchLocations = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('stock_levels')
        .select('location')
        .eq('tenant_id', tenant.id)
        .order('location');

      if (error) throw error;

      const uniqueLocations = [...new Set((data || []).map((item: any) => item.location as string))];
      setLocations(uniqueLocations);
      
      if (uniqueLocations.length > 0 && !selectedLocation) {
        setSelectedLocation(uniqueLocations[0]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

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
    fetchLocations();
  }, [tenant]);

  useEffect(() => {
    if (selectedLocation) {
      fetchStockLevels();
    }
  }, [selectedLocation, tenant]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Stock Levels</h2>
        {hasChanges && (
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Location:</label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Current Quantity</TableHead>
              <TableHead>Par Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockLevels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  {selectedLocation 
                    ? "No stock levels found for this location."
                    : "Select a location to view stock levels."
                  }
                </TableCell>
              </TableRow>
            ) : (
              stockLevels.map((stockLevel) => (
                <TableRow key={stockLevel.id}>
                  <TableCell className="font-medium">{stockLevel.item_name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={pendingChanges[stockLevel.id] ?? stockLevel.current_quantity}
                      onChange={(e) => handleQuantityChange(stockLevel.id, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>{stockLevel.par_level || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockLevelsView;
