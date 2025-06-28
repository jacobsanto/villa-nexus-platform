
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCatalogView from "./ItemCatalogView";
import StockLevelsView from "./StockLevelsView";

const InventoryPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Item Catalog</TabsTrigger>
          <TabsTrigger value="levels">Stock Levels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="mt-6">
          <ItemCatalogView />
        </TabsContent>
        
        <TabsContent value="levels" className="mt-6">
          <StockLevelsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
