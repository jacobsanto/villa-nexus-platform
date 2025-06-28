import { useMemo } from "react";
import { isToday, isTomorrow, isThisWeek, isPast, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
import { Task } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TaskAgendaViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

interface TaskGroup {
  title: string;
  tasks: Task[];
  priority: number;
}

const TaskAgendaView = ({ tasks, onTaskClick }: TaskAgendaViewProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overdue", "today", "tomorrow"])
  );

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const taskGroups = useMemo(() => {
    const groups: TaskGroup[] = [
      { title: "overdue", tasks: [], priority: 1 },
      { title: "today", tasks: [], priority: 2 },
      { title: "tomorrow", tasks: [], priority: 3 },
      { title: "thisweek", tasks: [], priority: 4 },
      { title: "later", tasks: [], priority: 5 },
    ];

    const groupMap = {
      overdue: groups[0],
      today: groups[1],
      tomorrow: groups[2],
      thisweek: groups[3],
      later: groups[4],
    };

    tasks.forEach((task) => {
      if (!task.due_date) {
        groupMap.later.tasks.push(task);
        return;
      }

      const taskDate = parseISO(task.due_date);
      
      if (isPast(taskDate) && !isToday(taskDate)) {
        groupMap.overdue.tasks.push(task);
      } else if (isToday(taskDate)) {
        groupMap.today.tasks.push(task);
      } else if (isTomorrow(taskDate)) {
        groupMap.tomorrow.tasks.push(task);
      } else if (isThisWeek(taskDate)) {
        groupMap.thisweek.tasks.push(task);
      } else {
        groupMap.later.tasks.push(task);
      }
    });

    return groups.filter(group => group.tasks.length > 0);
  }, [tasks]);

  const getGroupDisplayTitle = (title: string) => {
    switch (title) {
      case "overdue":
        return "Overdue";
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "thisweek":
        return "This Week";
      case "later":
        return "Later";
      default:
        return title;
    }
  };

  const getGroupColor = (title: string) => {
    switch (title) {
      case "overdue":
        return "border-t-4 border-t-red-400";
      case "today":
        return "border-t-4 border-t-blue-400";
      case "tomorrow":
        return "border-t-4 border-t-yellow-400";
      case "thisweek":
        return "border-t-4 border-t-green-400";
      case "later":
        return "border-t-4 border-t-gray-400";
      default:
        return "border-t-4 border-t-gray-400";
    }
  };

  const getTaskCountBadgeColor = (title: string) => {
    switch (title) {
      case "overdue":
        return "bg-red-100 text-red-800";
      case "today":
        return "bg-blue-100 text-blue-800";
      case "tomorrow":
        return "bg-yellow-100 text-yellow-800";
      case "thisweek":
        return "bg-green-100 text-green-800";
      case "later":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {taskGroups.map((group) => {
        const isExpanded = expandedSections.has(group.title);
        const displayTitle = getGroupDisplayTitle(group.title);
        
        return (
          <Card key={group.title} className={`${getGroupColor(group.title)}`}>
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(group.title)}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <span>{displayTitle}</span>
                </div>
                <Badge className={getTaskCountBadgeColor(group.title)}>
                  {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {group.tasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={onTaskClick ? () => onTaskClick(task) : undefined}
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {taskGroups.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};

export default TaskAgendaView;
