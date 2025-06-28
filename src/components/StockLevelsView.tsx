
import { Button } from "@/components/ui/button";
import { useStockLevels } from "@/hooks/useStockLevels";
import { useStockLocations } from "@/hooks/useStockLocations";
import LocationSelector from "./LocationSelector";
import StockLevelsTable from "./StockLevelsTable";

const StockLevelsView = () => {
  const { locations, selectedLocation, setSelectedLocation } = useStockLocations();
  const { 
    stockLevels, 
    loading, 
    hasChanges, 
    pendingChanges, 
    handleQuantityChange, 
    saveChanges 
  } = useStockLevels(selectedLocation);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Stock Levels</h2>
        {hasChanges && (
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        )}
      </div>

      <LocationSelector
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

      <StockLevelsTable
        stockLevels={stockLevels}
        selectedLocation={selectedLocation}
        pendingChanges={pendingChanges}
        onQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

export default StockLevelsView;
