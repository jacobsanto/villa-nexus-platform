
import { Building2, Plus, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddProperty: () => void;
  onSyncPMS: () => void;
}

const EmptyState = ({ onAddProperty, onSyncPMS }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Building2 className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No properties found
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        Get started by syncing with your Property Management System or adding properties manually.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onSyncPMS} className="flex items-center">
          <Plug className="w-4 h-4 mr-2" />
          Sync with PMS
        </Button>
        
        <Button variant="outline" onClick={onAddProperty} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Property Manually
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
