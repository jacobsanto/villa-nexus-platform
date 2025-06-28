
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  task_type: string;
  due_date?: string;
  assigned_to?: string;
  assignee_name?: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
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

  const formatTaskType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="mb-3 cursor-grab hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{task.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getTaskTypeBadgeColor(task.task_type)}>
            {formatTaskType(task.task_type)}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.due_date && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(task.due_date), 'MMM dd')}
            </div>
          )}
          
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
      </CardContent>
    </Card>
  );
};

export default TaskCard;
