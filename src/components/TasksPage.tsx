
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import KanbanColumn from "./KanbanColumn";
import ViewSwitcher from "./ViewSwitcher";
import TaskListView from "./TaskListView";
import TaskAgendaView from "./TaskAgendaView";
import { Task } from "@/types";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'board' | 'list' | 'agenda'>('board');
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!profile?.tenant_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch tasks with joined data for assignee names
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assigned_to_fkey(full_name),
          property:properties!tasks_property_id_fkey(name)
        `)
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our Task interface
      const transformedTasks: Task[] = (tasksData || []).map(task => ({
        ...task,
        assignee_name: task.assignee?.full_name,
        property_name: task.property?.name,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [profile?.tenant_id]);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const renderBoardView = () => (
    <div className="flex gap-6 overflow-x-auto pb-4">
      <KanbanColumn 
        title="To-Do" 
        tasks={getTasksByStatus('to-do')} 
        status="to-do"
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={getTasksByStatus('in-progress')} 
        status="in-progress"
      />
      <KanbanColumn 
        title="Done" 
        tasks={getTasksByStatus('done')} 
        status="done"
      />
    </div>
  );

  const renderCurrentView = () => {
    switch (activeView) {
      case 'board':
        return renderBoardView();
      case 'list':
        return <TaskListView tasks={tasks} />;
      case 'agenda':
        return <TaskAgendaView tasks={tasks} />;
      default:
        return renderBoardView();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        </div>
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-80 h-96 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage your team's tasks and assignments
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <ViewSwitcher activeView={activeView} setActiveView={setActiveView} />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        {renderCurrentView()}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">No tasks found</p>
            <p className="text-gray-400 text-sm">Create your first task to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
