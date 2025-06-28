
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Get an overview of your property management activities and key metrics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Properties Overview</CardTitle>
            <CardDescription>Quick summary of your property portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-500">Total Properties</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>Current reservations and occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">128</p>
            <p className="text-sm text-gray-500">Active Bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>This month's earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$48,392</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
