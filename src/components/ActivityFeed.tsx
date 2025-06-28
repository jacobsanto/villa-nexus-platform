
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import { Booking, Task } from "@/types";

interface ActivityFeedProps {
  tasks: Task[];
  bookings: Booking[];
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'task';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: 'calendar' | 'check' | 'clock' | 'user';
}

const ActivityFeed = ({ tasks, bookings }: ActivityFeedProps) => {
  const processActivityData = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Process recent bookings
    bookings.slice(0, 5).forEach(booking => {
      activities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: `New Booking: ${booking.guest_name || 'Guest'}`,
        subtitle: booking.property_name || 'Property',
        timestamp: new Date(booking.created_at).toLocaleDateString(),
        icon: 'calendar',
      });
    });

    // Process recent tasks
    tasks.slice(0, 5).forEach(task => {
      const isCompleted = task.status === 'completed';
      activities.push({
        id: `task-${task.id}`,
        type: 'task',
        title: `${isCompleted ? 'Task Completed' : 'New Task'}: ${task.title}`,
        subtitle: task.assignee_name || 'Unassigned',
        timestamp: new Date(task.created_at).toLocaleDateString(),
        icon: isCompleted ? 'check' : 'clock',
      });
    });

    // Sort by timestamp (most recent first) and take top 8
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  };

  const activityData = processActivityData();

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'check':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activityData.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
