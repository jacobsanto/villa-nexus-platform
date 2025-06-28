
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchTenant = async () => {
      if (!profile?.tenant_id) {
        setTenant(null);
        setLoading(false);
        return;
      }

      try {
        const { data: tenantData, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (error) {
          console.error('Error fetching tenant:', error);
          setTenant(null);
        } else {
          setTenant(tenantData);
          
          // Apply tenant branding to CSS variables
          if (tenantData?.primary_color) {
            document.documentElement.style.setProperty('--tenant-primary', tenantData.primary_color);
          }
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        setTenant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [profile?.tenant_id]);

  const value = {
    tenant,
    loading,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
