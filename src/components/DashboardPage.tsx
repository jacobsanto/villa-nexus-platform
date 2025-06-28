
import { useState, useEffect } from "react";
import { Building2, Calendar, Clock, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import { Property, Booking, Task } from "@/types";
import StatCard from "./StatCard";
import OccupancyChart from "./OccupancyChart";
import ActivityFeed from "./ActivityFeed";
import DashboardSkeleton from "./DashboardSkeleton";

interface KpiData {
  totalProperties: number;
  activeBookings: number;
  upcomingArrivals: number;
  pendingTasks: number;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KpiData>({
    totalProperties: 0,
    activeBookings: 0,
    upcomingArrivals: 0,
    pendingTasks: 0,
  });
  const [chartData, setChartData] = useState<Booking[]>([]);
  const [activityData, setActivityData] = useState<{ tasks: Task[]; bookings: Booking[] }>({
    tasks: [],
    bookings: [],
  });

  const { tenant } = useTenant();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    if (!tenant?.id) return;

    try {
      // Fetch properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', tenant.id);

      if (propertiesError) throw propertiesError;

      // Fetch bookings with property names
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(name)
        `)
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch tasks with assignee names and property names
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles(full_name),
          property:properties(name)
        `)
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Process data for KPIs
      const today = new Date();
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);

      // Transform bookings data to include property names
      const transformedBookings: Booking[] = (bookings || []).map(booking => ({
        ...booking,
        property_name: booking.property?.name || 'Unknown Property'
      }));

      // Transform tasks data to include assignee and property names
      const transformedTasks: Task[] = (tasks || []).map(task => ({
        ...task,
        assignee_name: task.assignee?.full_name || 'Unassigned',
        property_name: task.property?.name || undefined
      }));

      // Calculate KPIs
      const activeBookings = transformedBookings.filter(booking => {
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        return today >= checkIn && today < checkOut;
      }).length;

      const upcomingArrivals = transformedBookings.filter(booking => {
        const checkIn = new Date(booking.check_in_date);
        return checkIn >= today && checkIn <= next7Days;
      }).length;

      const pendingTasks = transformedTasks.filter(task => 
        task.status !== 'completed'
      ).length;

      setKpiData({
        totalProperties: properties?.length || 0,
        activeBookings,
        upcomingArrivals,
        pendingTasks,
      });

      setChartData(transformedBookings);
      setActivityData({
        tasks: transformedTasks.slice(0, 10),
        bookings: transformedBookings.slice(0, 10),
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [tenant?.id]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Get an overview of your property management activities and key metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Properties"
          value={kpiData.totalProperties.toString()}
          icon={Building2}
          trend="+2 this month"
        />
        <StatCard
          title="Active Bookings"
          value={kpiData.activeBookings.toString()}
          icon={Calendar}
          trend="+12% vs last week"
        />
        <StatCard
          title="Upcoming Arrivals"
          value={kpiData.upcomingArrivals.toString()}
          icon={Clock}
          trend="Next 7 days"
        />
        <StatCard
          title="Pending Tasks"
          value={kpiData.pendingTasks.toString()}
          icon={CheckSquare}
          trend={kpiData.pendingTasks > 5 ? "High priority" : "On track"}
        />
      </div>

      {/* Chart and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OccupancyChart bookingData={chartData} />
        </div>
        <div>
          <ActivityFeed tasks={activityData.tasks} bookings={activityData.bookings} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
