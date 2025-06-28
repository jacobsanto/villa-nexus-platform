
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

export interface Task {
  id: string;
  created_at: string;
  tenant_id: string;
  property_id?: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
  task_type: string;
  assignee_name?: string; // This will be joined from profiles table
  property_name?: string; // This will be joined from properties table
}

export interface Booking {
  id: string;
  created_at: string;
  tenant_id: string;
  property_id: string;
  guest_name?: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests?: number;
  total_revenue?: number;
  status: string;
  source?: string;
  external_id?: string;
  property_name?: string; // This will be joined from properties table
}

export interface Report {
  id: string;
  created_at: string;
  tenant_id: string;
  created_by: string;
  name: string;
  description?: string;
  report_type: string;
  filters?: any;
}
