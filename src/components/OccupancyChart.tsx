import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTenant } from '@/contexts/TenantContext';

interface OccupancyChartProps {
  className?: string;
}

const OccupancyChart = ({ className }: OccupancyChartProps) => {
  const { tenant } = useTenant();
  const chartData = [
    { month: 'Jan', occupancy: 75 },
    { month: 'Feb', occupancy: 60 },
    { month: 'Mar', occupancy: 80 },
    { month: 'Apr', occupancy: 90 },
    { month: 'May', occupancy: 70 },
    { month: 'Jun', occupancy: 85 },
    { month: 'Jul', occupancy: 95 },
    { month: 'Aug', occupancy: 88 },
    { month: 'Sep', occupancy: 78 },
    { month: 'Oct', occupancy: 82 },
    { month: 'Nov', occupancy: 68 },
    { month: 'Dec', occupancy: 72 },
  ];

  const primaryColor = tenant?.brand_color_primary || '#4f46e5';

  // Calculate average occupancy
  const totalOccupancy = chartData.reduce((sum, data) => sum + data.occupancy, 0);
  const averageOccupancy = totalOccupancy / chartData.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="occupancy" 
              stroke={primaryColor}
              fill={primaryColor}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
