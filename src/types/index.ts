
export interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface UserProfile {
  id: string;
  tenant_id?: string;
  full_name: string;
  role: 'admin' | 'member' | 'super_admin';
  created_at: string;
}

export interface Integration {
  id: string;
  name: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface TenantIntegration {
  id: string;
  tenant_id: string;
  integration_id: string;
  api_credentials?: any;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
}

export interface Property {
  id: string;
  tenant_id: string;
  integration_id: string;
  external_id: string;
  name: string;
  address?: string;
  image_url?: string;
  bedrooms?: number;
  bathrooms?: number;
  status: 'active' | 'inactive' | 'maintenance';
  nightly_rate?: number;
  created_at: string;
  updated_at: string;
}
