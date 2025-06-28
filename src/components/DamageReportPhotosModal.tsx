
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2 } from "lucide-react";
import { useDamageReportPhotos } from "@/hooks/useDamageReportPhotos";
import { useAuth } from "@/contexts/AuthContext";

interface DamageReportPhotosModalProps {
  reportId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DamageReportPhotosModal = ({ reportId, open, onOpenChange }: DamageReportPhotosModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { photos, loading, uploading, uploadPhoto, deletePhoto, getPhotoUrl } = useDamageReportPhotos(reportId || undefined);
  const { profile } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPhoto(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (photoId: string, photoPath: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto(photoId, photoPath);
    }
  };

  if (!reportId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Damage Report Photos</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No photos uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={getPhotoUrl(photo.photo_path)}
                    alt="Damage report"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {photo.uploaded_by === profile?.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(photo.id, photo.photo_path)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DamageReportPhotosModal;
