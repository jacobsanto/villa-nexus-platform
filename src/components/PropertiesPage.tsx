
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

const PropertiesPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Your Properties</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all your rental properties in one place.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Ocean View Villa
            </CardTitle>
            <CardDescription>Beachfront property with 4 bedrooms</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Status: Available</p>
            <p className="text-sm text-gray-500">Rate: $450/night</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Mountain Cabin
            </CardTitle>
            <CardDescription>Cozy retreat with fireplace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Status: Occupied</p>
            <p className="text-sm text-gray-500">Rate: $275/night</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              City Apartment
            </CardTitle>
            <CardDescription>Modern downtown unit</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Status: Available</p>
            <p className="text-sm text-gray-500">Rate: $320/night</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertiesPage;
