
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { CreateDamageReportData } from "@/types/damageReports";

interface Property {
  id: string;
  name: string;
}

interface CreateDamageReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDamageReportData) => Promise<any>;
}

const CreateDamageReportModal = ({ open, onOpenChange, onSubmit }: CreateDamageReportModalProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState<CreateDamageReportData>({
    property_id: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { tenant } = useTenant();

  const fetchProperties = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .eq('tenant_id', tenant.id)
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id || !formData.description) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ property_id: '', description: '' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProperties();
    }
  }, [open, tenant?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Damage Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Select
              value={formData.property_id}
              onValueChange={(value) => setFormData({ ...formData, property_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the damage in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.property_id || !formData.description || submitting}
            >
              {submitting ? 'Creating...' : 'Create Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDamageReportModal;
