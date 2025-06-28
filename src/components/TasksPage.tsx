
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import KanbanColumn from "./KanbanColumn";
import ViewSwitcher from "./ViewSwitcher";

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

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'board' | 'list' | 'agenda'>('board');

  // Mock data for demonstration
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Repair air conditioning - Ocean View Villa',
      description: 'High priority maintenance request',
      status: 'to-do',
      task_type: 'maintenance',
      due_date: '2024-01-15',
      assigned_to: '1',
      assignee_name: 'John Smith'
    },
    {
      id: '2',
      title: 'Deep cleaning - Mountain Cabin',
      description: 'Scheduled cleaning between guests',
      status: 'in-progress',
      task_type: 'housekeeping',
      due_date: '2024-01-16',
      assigned_to: '2',
      assignee_name: 'Cleaning Team A'
    },
    {
      id: '3',
      title: 'Property inspection - City Apartment',
      description: 'Monthly safety inspection completed',
      status: 'done',
      task_type: 'inspection',
      due_date: '2024-01-14',
      assigned_to: '3',
      assignee_name: 'Sarah Johnson'
    },
    {
      id: '4',
      title: 'Replace broken window - Beach House',
      description: 'Guest reported cracked window in bedroom',
      status: 'to-do',
      task_type: 'maintenance',
      due_date: '2024-01-17',
      assigned_to: '1',
      assignee_name: 'John Smith'
    },
    {
      id: '5',
      title: 'Stock bathroom supplies - Downtown Loft',
      description: 'Restock towels and toiletries',
      status: 'to-do',
      task_type: 'housekeeping',
      due_date: '2024-01-18'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTasks = async () => {
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTasks(mockTasks);
      setLoading(false);
    };

    fetchTasks();
  }, []);

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

  const renderPlaceholderView = (viewName: string) => (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-2">{viewName} View</p>
        <p className="text-gray-400 text-sm">Coming soon...</p>
      </div>
    </div>
  );

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
        {activeView === 'board' && renderBoardView()}
        {activeView === 'list' && renderPlaceholderView('List')}
        {activeView === 'agenda' && renderPlaceholderView('Agenda')}
      </div>
    </div>
  );
};

export default TasksPage;
