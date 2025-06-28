
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => {
  const getTrendColor = (trendValue?: string) => {
    if (!trendValue) return "";
    const isPositive = trendValue.startsWith("+");
    return isPositive ? "text-green-600" : "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <p className={`text-xs font-medium mt-1 ${getTrendColor(trend)}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
