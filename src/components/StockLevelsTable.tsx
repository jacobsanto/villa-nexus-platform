
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StockLevel {
  id: string;
  item_id: string;
  location: string;
  current_quantity: number;
  par_level?: number;
  item_name: string;
}

interface StockLevelsTableProps {
  stockLevels: StockLevel[];
  selectedLocation: string;
  pendingChanges: Record<string, number>;
  onQuantityChange: (stockLevelId: string, newQuantity: string) => void;
}

const StockLevelsTable = ({ 
  stockLevels, 
  selectedLocation, 
  pendingChanges, 
  onQuantityChange 
}: StockLevelsTableProps) => {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Current Quantity</TableHead>
            <TableHead>Par Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockLevels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                {selectedLocation 
                  ? "No stock levels found for this location."
                  : "Select a location to view stock levels."
                }
              </TableCell>
            </TableRow>
          ) : (
            stockLevels.map((stockLevel) => (
              <TableRow key={stockLevel.id}>
                <TableCell className="font-medium">{stockLevel.item_name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={pendingChanges[stockLevel.id] ?? stockLevel.current_quantity}
                    onChange={(e) => onQuantityChange(stockLevel.id, e.target.value)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>{stockLevel.par_level || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockLevelsTable;
