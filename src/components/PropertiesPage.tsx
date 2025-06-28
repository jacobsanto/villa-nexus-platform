
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Plug, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types";
import PropertyCard from "./PropertyCard";
import AddPropertyModal from "./AddPropertyModal";
import EmptyState from "./EmptyState";
import PropertySkeleton from "./PropertySkeleton";

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [profile?.tenant_id]);

  const handleSyncPMS = () => {
    toast({
      title: "Coming Soon",
      description: "PMS sync functionality will be available soon!",
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProperties();
  };

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
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSyncPMS}
            className="flex items-center"
          >
            <Plug className="w-4 h-4 mr-2" />
            Sync with PMS
          </Button>
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
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
          onAddProperty={() => setIsAddModalOpen(true)}
          onSyncPMS={handleSyncPMS}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProperties}
      />
    </div>
  );
};

export default PropertiesPage;
