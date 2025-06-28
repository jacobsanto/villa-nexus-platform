
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaskListViewProps {
  tasks: Task[];
}

const TaskListView = ({ tasks }: TaskListViewProps) => {
  const getTaskTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'housekeeping':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'inspection':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'to-do':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTaskType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">{task.title}</h3>
              <Badge className={getStatusBadgeColor(task.status)}>
                {formatStatus(task.status)}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTaskTypeBadgeColor(task.task_type)}>
                {formatTaskType(task.task_type)}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                {task.due_date && (
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(task.due_date), 'MMM dd')}
                  </div>
                )}
                
                {task.property_name && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-20">{task.property_name}</span>
                  </div>
                )}
              </div>
              
              {task.assigned_to && (
                <div className="flex items-center">
                  <Avatar className="w-5 h-5 mr-1">
                    <AvatarFallback className="text-xs">
                      {task.assignee_name ? task.assignee_name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-20">
                    {task.assignee_name || 'Assigned'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge className={getTaskTypeBadgeColor(task.task_type)}>
                    {formatTaskType(task.task_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assigned_to ? (
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarFallback className="text-xs">
                          {task.assignee_name ? task.assignee_name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee_name || 'Assigned'}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.property_name ? (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{task.property_name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No property</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.due_date ? (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {format(new Date(task.due_date), 'MMM dd, yyyy')}
                    </div>
                  ) : (
                    <span className="text-gray-400">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {formatStatus(task.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};

export default TaskListView;
