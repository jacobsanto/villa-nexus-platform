
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { CreateDamageReportData } from "@/types/damageReports";
import PhotoUpload from "./PhotoUpload";
import { toast } from "sonner";

interface Property {
  id: string;
  name: string;
}

interface AddDamageReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDamageReportData) => Promise<any>;
}

const AddDamageReportModal = ({ open, onOpenChange, onSubmit }: AddDamageReportModalProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState<CreateDamageReportData>({
    property_id: '',
    description: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
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
      toast.error('Failed to load properties');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Create the damage report first
      const report = await onSubmit(formData);
      
      if (report && photos.length > 0) {
        // Upload photos if any were selected
        const uploadPromises = photos.map(async (photo) => {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${report.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('damage_reports')
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          // Save photo record to database
          const { error: dbError } = await supabase
            .from('damage_report_photos')
            .insert({
              report_id: report.id,
              photo_path: fileName,
              uploaded_by: report.reported_by
            });

          if (dbError) throw dbError;
        });

        await Promise.all(uploadPromises);
        toast.success('Report created with photos successfully');
      }

      // Reset form
      setFormData({ property_id: '', description: '' });
      setPhotos([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
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
      <DialogContent className="w-full max-w-lg mx-auto h-full md:h-auto md:max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Report New Damage</DialogTitle>
          <DialogDescription>
            Document property damage with photos and description
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Property Selection */}
            <div className="space-y-2">
              <Label htmlFor="property" className="text-base font-medium">
                Property *
              </Label>
              <Select
                value={formData.property_id}
                onValueChange={(value) => setFormData({ ...formData, property_id: value })}
              >
                <SelectTrigger className="h-12">
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the damage in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Photos</Label>
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 pt-4 border-t">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.property_id || !formData.description.trim() || submitting}
                className="flex-1 h-12"
              >
                {submitting ? 'Creating...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDamageReportModal;
