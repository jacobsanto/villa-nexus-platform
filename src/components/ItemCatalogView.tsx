
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  supplier?: string;
  low_stock_threshold?: number;
}

const ItemCatalogView = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const { tenant } = useTenant();
  const { profile } = useAuth();

  const isAdmin = profile?.role === 'admin';

  const fetchItems = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('inventory_items')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!isAdmin) return;

    const confirmed = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");
    if (!confirmed) return;

    setDeletingItemId(itemId);

    try {
      const { error } = await (supabase as any)
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeletingItemId(null);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [tenant]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Item Catalog</h2>
        {isAdmin && (
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
              {isAdmin && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={isAdmin ? 5 : 4} 
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center">
                    <Package className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No items found</p>
                    <p className="text-gray-400 text-sm">
                      {isAdmin ? "Create your first inventory item to get started." : "No inventory items available."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category || '-'}</TableCell>
                  <TableCell>{item.supplier || '-'}</TableCell>
                  <TableCell>{item.low_stock_threshold || '-'}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                          className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItemId === item.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isAdmin && (
        <>
          <AddItemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchItems();
              toast.success('Item added successfully');
            }}
          />

          {editingItem && (
            <EditItemModal
              isOpen={!!editingItem}
              onClose={() => setEditingItem(null)}
              item={editingItem}
              onSuccess={() => {
                setEditingItem(null);
                fetchItems();
                toast.success('Item updated successfully');
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ItemCatalogView;
