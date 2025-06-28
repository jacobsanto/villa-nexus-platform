
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Plug, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types";
import PropertyCard from "./PropertyCard";
import AddPropertyModal from "./AddPropertyModal";
import EmptyState from "./EmptyState";
import PropertySkeleton from "./PropertySkeleton";
import { toast } from "sonner";

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useAuth();

  const fetchProperties = async () => {
    if (!profile?.tenant_id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the status to the proper type to fix TypeScript error
      const typedProperties: Property[] = (data || []).map(property => ({
        ...property,
        status: property.status as 'active' | 'inactive' | 'maintenance'
      }));

      setProperties(typedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      console.log('Starting PMS sync...');
      
      const { data, error } = await supabase.functions.invoke('sync-pms', {
        method: 'POST'
      });

      if (error) {
        console.error('Sync error:', error);
        throw new Error(error.message || 'Failed to sync with PMS');
      }

      console.log('Sync response:', data);

      toast.success(data.message || `Successfully synced ${data.count || 0} properties`);

      // Refresh the properties list
      await fetchProperties();
      
    } catch (error) {
      console.error('Sync function error:', error);
      toast.error(error.message || 'Failed to sync with PMS. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [profile?.tenant_id]);

  const handleRefresh = () => {
    setLoading(true);
    fetchProperties();
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">
            Manage your property portfolio
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {isAdmin && (
            <>
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plug className="w-4 h-4 mr-2" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync with PMS'}
              </Button>
              
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <PropertySkeleton key={index} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState 
          onAddProperty={isAdmin ? () => setIsAddModalOpen(true) : undefined}
          onSyncPMS={isAdmin ? handleSync : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {isAdmin && (
        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchProperties();
            toast.success('Property added successfully');
          }}
        />
      )}
    </div>
  );
};

export default PropertiesPage;
