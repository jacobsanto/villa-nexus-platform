import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import { DamageReport, CreateDamageReportData } from "@/types/damageReports";
import { toast } from "sonner";

export const useDamageReports = () => {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenant } = useTenant();
  const { profile } = useAuth();

  const fetchReports = async () => {
    if (!tenant?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('damage_reports')
        .select(`
          *,
          properties(name),
          profiles(full_name)
        `)
        .eq('tenant_id', tenant.id)
        .order('reported_at', { ascending: false });

      if (error) throw error;

      const typedReports: DamageReport[] = (data || []).map(report => ({
        id: report.id,
        tenant_id: report.tenant_id,
        property_id: report.property_id,
        reported_by: report.reported_by,
        description: report.description,
        status: report.status as DamageReport['status'],
        reported_at: report.reported_at,
        property_name: report.properties?.name,
        reporter_name: report.profiles?.full_name
      }));

      setReports(typedReports);
    } catch (error) {
      console.error('Error fetching damage reports:', error);
      toast.error('Failed to load damage reports');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: CreateDamageReportData) => {
    if (!tenant?.id || !profile?.id) {
      toast.error('Unable to create report');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('damage_reports')
        .insert({
          tenant_id: tenant.id,
          property_id: reportData.property_id,
          reported_by: profile.id,
          description: reportData.description
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Damage report created successfully');
      fetchReports();
      return data;
    } catch (error) {
      console.error('Error creating damage report:', error);
      toast.error('Failed to create damage report');
      return null;
    }
  };

  const updateReportStatus = async (reportId: string, status: DamageReport['status']) => {
    try {
      const { error } = await supabase
        .from('damage_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;

      toast.success('Report status updated');
      fetchReports();
    } catch (error) {
      console.error('Error updating report status:', error);
      toast.error('Failed to update report status');
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('damage_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [tenant?.id]);

  return {
    reports,
    loading,
    createReport,
    updateReportStatus,
    deleteReport,
    refreshReports: fetchReports
  };
};
