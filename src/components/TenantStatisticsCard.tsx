
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TenantStatisticsCard = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">-</p>
            <p className="text-gray-300 text-sm">Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">-</p>
            <p className="text-gray-300 text-sm">Properties</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">-</p>
            <p className="text-gray-300 text-sm">Bookings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantStatisticsCard;
