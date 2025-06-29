
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeleteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  onTenantDeleted: () => void;
}

const DeleteTenantModal = ({ isOpen, onClose, tenantId, tenantName, onTenantDeleted }: DeleteTenantModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('delete_tenant', {
        tenant_id: tenantId
      });

      if (error) {
        throw error;
      }

      const result = data as { success: boolean; error?: string; message?: string };

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete tenant');
      }

      toast({
        title: "Success",
        description: "Tenant and all associated data have been deleted successfully.",
      });

      onTenantDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tenant",
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
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Tenant
          </DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to delete <strong>{tenantName}</strong>?
            <br />
            <br />
            This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The tenant and all their settings</li>
              <li>All users associated with this tenant</li>
              <li>All properties, bookings, and tasks</li>
              <li>All inventory and damage reports</li>
              <li>All other associated data</li>
            </ul>
            <br />
            <strong className="text-red-600">This action cannot be undone.</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTenantModal;
