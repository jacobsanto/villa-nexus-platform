
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationSelectorProps {
  locations: string[];
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector = ({ locations, selectedLocation, onLocationChange }: LocationSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Location:</label>
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
