
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image } from "lucide-react";

interface LogoUploaderProps {
  tenantId: string;
  currentLogoUrl?: string;
  onUpdate: () => void;
}

const LogoUploader = ({ tenantId, currentLogoUrl, onUpdate }: LogoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/logo.${fileExt}`;

      // Remove existing logo if it exists
      if (currentLogoUrl) {
        const existingPath = currentLogoUrl.replace('/storage/v1/object/public/tenant-logos/', '');
        await supabase.storage
          .from('tenant-logos')
          .remove([existingPath]);
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('tenant-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tenant-logos')
        .getPublicUrl(fileName);

      // Update tenant record
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ logo_url: publicUrl })
        .eq('id', tenantId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;

    setRemoving(true);

    try {
      // Remove from storage
      const path = currentLogoUrl.replace('/storage/v1/object/public/tenant-logos/', '');
      const { error: removeError } = await supabase.storage
        .from('tenant-logos')
        .remove([path]);

      if (removeError) throw removeError;

      // Update tenant record
      const { error: updateError } = await supabase
        .from('tenants')
        .update({ logo_url: null })
        .eq('id', tenantId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Logo removed successfully",
      });

      onUpdate();
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive",
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Image className="w-5 h-5 mr-2" />
          Company Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Preview */}
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-lg">
          {currentLogoUrl ? (
            <img 
              src={currentLogoUrl} 
              alt="Company logo"
              className="max-h-24 max-w-full object-contain bg-white rounded p-2"
            />
          ) : (
            <div className="text-center">
              <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400 text-sm">No logo uploaded</p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload New Logo'}
              </span>
            </Button>
          </label>

          {/* Remove Button */}
          {currentLogoUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveLogo}
              disabled={removing}
              className="w-full bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {removing ? 'Removing...' : 'Remove Logo'}
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Supported formats: JPEG, PNG, WebP, SVG. Max size: 5MB
        </p>
      </CardContent>
    </Card>
  );
};

export default LogoUploader;
