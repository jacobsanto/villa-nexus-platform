
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DamageReportPhoto } from "@/types/damageReports";
import { toast } from "sonner";

export const useDamageReportPhotos = (reportId?: string) => {
  const [photos, setPhotos] = useState<DamageReportPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { profile } = useAuth();

  const fetchPhotos = async () => {
    if (!reportId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('damage_report_photos')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!reportId || !profile?.id) {
      toast.error('Unable to upload photo');
      return null;
    }

    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${reportId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('damage_reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save photo record to database
      const { data, error: dbError } = await supabase
        .from('damage_report_photos')
        .insert({
          report_id: reportId,
          photo_path: fileName,
          uploaded_by: profile.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Photo uploaded successfully');
      fetchPhotos();
      return data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string, photoPath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('damage_reports')
        .remove([photoPath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('damage_report_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      toast.success('Photo deleted successfully');
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const getPhotoUrl = (photoPath: string) => {
    const { data } = supabase.storage
      .from('damage_reports')
      .getPublicUrl(photoPath);
    
    return data.publicUrl;
  };

  useEffect(() => {
    fetchPhotos();
  }, [reportId]);

  return {
    photos,
    loading,
    uploading,
    uploadPhoto,
    deletePhoto,
    getPhotoUrl,
    refreshPhotos: fetchPhotos
  };
};
