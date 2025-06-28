
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantAdded: () => void;
}

const AddTenantModal = ({ isOpen, onClose, onTenantAdded }: AddTenantModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    primaryColor: '#0ea5e9'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('tenants')
        .insert([
          {
            name: formData.name,
            logo_url: formData.logoUrl || null,
            primary_color: formData.primaryColor,
            status: 'active'
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Tenant created successfully",
      });

      // Reset form
      setFormData({
        name: '',
        logoUrl: '',
        primaryColor: '#0ea5e9'
      });

      onTenantAdded();
      onClose();
    } catch (error) {
      console.error('Error creating tenant:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      logoUrl: '',
      primaryColor: '#0ea5e9'
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
          <DialogDescription>
            Create a new property management company account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Coastal Properties"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL (Optional)</Label>
            <Input
              id="logo-url"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
              placeholder="https://example.com/logo.png"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Brand Color</Label>
            <Input
              id="primary-color"
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
              className="h-10"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading || !formData.name}
            >
              {loading ? "Creating..." : "Add Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantModal;
