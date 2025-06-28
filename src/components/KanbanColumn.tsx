
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "./TaskCard";
import { Task } from "@/types";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: string;
}

const KanbanColumn = ({ title, tasks, status }: KanbanColumnProps) => {
  const getColumnColor = (status: string) => {
    switch (status) {
      case 'to-do':
        return 'border-t-4 border-t-gray-400';
      case 'in-progress':
        return 'border-t-4 border-t-yellow-400';
      case 'done':
        return 'border-t-4 border-t-green-400';
      default:
        return 'border-t-4 border-t-gray-400';
    }
  };

  return (
    <Card className={`flex-shrink-0 w-80 h-fit max-h-[calc(100vh-200px)] ${getColumnColor(status)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <span className="text-sm font-normal bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0 max-h-96 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
