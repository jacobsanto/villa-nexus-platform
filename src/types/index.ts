
export interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  guesty_api_key?: string;
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
