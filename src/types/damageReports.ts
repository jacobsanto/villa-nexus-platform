
export interface DamageReport {
  id: string;
  tenant_id: string;
  property_id: string;
  reported_by: string;
  description: string;
  status: 'reported' | 'assessed' | 'resolved';
  reported_at: string;
  property_name?: string;
  reporter_name?: string;
}

export interface DamageReportPhoto {
  id: string;
  report_id: string;
  photo_path: string;
  uploaded_by: string;
  created_at: string;
}

export interface CreateDamageReportData {
  property_id: string;
  description: string;
}
