
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string | null;
}

const AddBookingModal = ({ isOpen, onClose, onSuccess, initialDate }: AddBookingModalProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    guest_name: '',
    check_in_date: initialDate || '',
    check_out_date: '',
    number_of_guests: 1,
    total_revenue: '',
    status: 'confirmed',
    source: 'Manual'
  });
  
  const { tenant } = useTenant();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && tenant?.id) {
      fetchProperties();
    }
  }, [isOpen, tenant?.id]);

  useEffect(() => {
    if (initialDate) {
      setFormData(prev => ({ ...prev, check_in_date: initialDate }));
    }
  }, [initialDate]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', tenant?.id)
        .eq('status', 'active');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          tenant_id: tenant.id,
          property_id: formData.property_id,
          guest_name: formData.guest_name,
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          number_of_guests: formData.number_of_guests,
          total_revenue: formData.total_revenue ? parseFloat(formData.total_revenue) : null,
          status: formData.status,
          source: formData.source
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking created successfully",
      });
      
      onSuccess();
      setFormData({
        property_id: '',
        guest_name: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        total_revenue: '',
        status: 'confirmed',
        source: 'Manual'
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="property">Property</Label>
            <Select 
              value={formData.property_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, property_id: value }))}
              required
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

          <div>
            <Label htmlFor="guest_name">Guest Name</Label>
            <Input
              id="guest_name"
              value={formData.guest_name}
              onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
              placeholder="Enter guest name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check_in_date">Check-in Date</Label>
              <Input
                id="check_in_date"
                type="date"
                value={formData.check_in_date}
                onChange={(e) => setFormData(prev => ({ ...prev, check_in_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="check_out_date">Check-out Date</Label>
              <Input
                id="check_out_date"
                type="date"
                value={formData.check_out_date}
                onChange={(e) => setFormData(prev => ({ ...prev, check_out_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number_of_guests">Number of Guests</Label>
              <Input
                id="number_of_guests"
                type="number"
                min="1"
                value={formData.number_of_guests}
                onChange={(e) => setFormData(prev => ({ ...prev, number_of_guests: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="total_revenue">Total Revenue</Label>
              <Input
                id="total_revenue"
                type="number"
                step="0.01"
                value={formData.total_revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, total_revenue: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: tenant?.primary_color || '#0ea5e9' }}
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingModal;
