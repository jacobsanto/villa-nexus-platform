
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddItemModal = ({ isOpen, onClose, onSuccess }: AddItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    low_stock_threshold: "",
    description: "",
    unit_of_measure: "",
  });
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenant();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          tenant_id: tenant.id,
          name: formData.name,
          category: formData.category || null,
          supplier: formData.supplier || null,
          low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : null,
          description: formData.description || null,
          unit_of_measure: formData.unit_of_measure || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item created successfully",
      });
      
      setFormData({
        name: "",
        category: "",
        supplier: "",
        low_stock_threshold: "",
        description: "",
        unit_of_measure: "",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="unit_of_measure">Unit of Measure</Label>
            <Input
              id="unit_of_measure"
              value={formData.unit_of_measure}
              onChange={(e) => handleInputChange('unit_of_measure', e.target.value)}
              placeholder="e.g., pieces, kg, liters"
            />
          </div>

          <div>
            <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
            <Input
              id="low_stock_threshold"
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => handleInputChange('low_stock_threshold', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
