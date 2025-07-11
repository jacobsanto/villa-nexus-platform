
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
      // Guard clause: Don't attempt to fetch tenant data if auth is loading, 
      // no profile, or user is super_admin
      if (authLoading || !profile || profile.role === 'super_admin') {
        setTenant(null);
        setLoading(false);
        setError(null);
        return;
      }

      // No tenant_id for this user
      if (!profile.tenant_id) {
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
          if (typedTenant) {
            document.documentElement.style.setProperty('--tenant-primary', typedTenant.brand_color_primary);
            document.documentElement.style.setProperty('--tenant-secondary', typedTenant.brand_color_secondary);
            document.documentElement.style.setProperty('--tenant-background', typedTenant.brand_color_background);
            document.documentElement.style.setProperty('--tenant-text', typedTenant.brand_color_text);
            document.documentElement.style.setProperty('--tenant-font', typedTenant.brand_font_family);
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
