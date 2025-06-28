
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/types';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchTenant = async () => {
      // Wait for auth to complete
      if (authLoading) {
        return;
      }

      // Super admins don't have tenants
      if (profile?.role === 'super_admin') {
        setTenant(null);
        setLoading(false);
        setError(null);
        return;
      }

      // No profile or no tenant_id
      if (!profile?.tenant_id) {
        setTenant(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data: tenantData, error: fetchError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (fetchError) {
          console.error('Error fetching tenant:', fetchError);
          setError('Failed to load tenant data');
          setTenant(null);
        } else {
          const typedTenant: Tenant = {
            ...tenantData,
            status: tenantData.status as 'active' | 'inactive'
          };
          setTenant(typedTenant);
          
          // Apply tenant branding to CSS variables
          if (typedTenant?.primary_color) {
            document.documentElement.style.setProperty('--tenant-primary', typedTenant.primary_color);
          }
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        setError('Failed to load tenant data');
        setTenant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [profile, authLoading]);

  const value = {
    tenant,
    loading,
    error,
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
