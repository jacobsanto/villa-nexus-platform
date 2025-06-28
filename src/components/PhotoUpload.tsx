
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Plus } from "lucide-react";

interface PhotoUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
}

const PhotoUpload = ({ photos, onPhotosChange }: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert('Only image files are allowed');
    }
    
    onPhotosChange([...photos, ...validFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Add Photos Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-12 border-dashed border-2"
      >
        <Camera className="w-5 h-5 mr-2" />
        Add Photos
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={createPreviewUrl(photo)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removePhoto(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          
          {/* Add More Photos Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
