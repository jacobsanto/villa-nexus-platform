
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Booking } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

interface OccupancyChartProps {
  bookingData: Booking[];
}

const OccupancyChart = ({ bookingData }: OccupancyChartProps) => {
  const { tenant } = useTenant();

  // Process booking data to calculate 7-day occupancy forecast
  const processOccupancyData = () => {
    const today = new Date();
    const next7Days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count bookings that span this date
      const occupiedProperties = bookingData.filter(booking => {
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        const currentDate = new Date(dateStr);
        
        return currentDate >= checkIn && currentDate < checkOut;
      }).length;

      next7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        occupied: occupiedProperties,
      });
    }
    
    return next7Days;
  };

  const chartData = processOccupancyData();

  const chartConfig = {
    occupied: {
      label: "Occupied Properties",
      color: tenant?.primary_color || "#0ea5e9",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Occupancy Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="occupied" 
                fill={tenant?.primary_color || "#0ea5e9"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;
