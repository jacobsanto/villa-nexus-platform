import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Task, Property, UserProfile } from "@/types";
import { toast } from "sonner";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

const TaskDetailModal = ({ isOpen, onClose, onSuccess, task }: TaskDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_id: "",
    assigned_to: "",
    due_date: undefined as Date | undefined,
    task_type: "general",
    status: "to-do"
  });

  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        property_id: task.property_id || "",
        assigned_to: task.assigned_to || "",
        due_date: task.due_date ? parseISO(task.due_date) : undefined,
        task_type: task.task_type || "general",
        status: task.status || "to-do"
      });
      
      if (profile?.tenant_id) {
        fetchProperties();
        fetchTeamMembers();
      }
    }
  }, [task, isOpen, profile?.tenant_id]);

  const fetchProperties = async () => {
    if (!profile?.tenant_id) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('name');

      if (error) throw error;
      setProperties((data || []) as Property[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchTeamMembers = async () => {
    if (!profile?.tenant_id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('full_name');

      if (error) throw error;
      setTeamMembers((data || []) as UserProfile[]);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !task) {
      toast.error('Task title is required');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        property_id: formData.property_id || null,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null,
        task_type: formData.task_type,
        status: formData.status
      };

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', task.id);

      if (error) throw error;

      toast.success('Task updated successfully');
      setIsEditing(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    const confirmed = window.confirm("Are you sure you want to delete this task? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      toast.success('Task deleted successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

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

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
        </DialogHeader>
        
        {!isEditing ? (
          // View Mode
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Title</Label>
              <p className="text-lg font-semibold">{task.title}</p>
            </div>

            {task.description && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="text-gray-700">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <div className="mt-1">
                  <Badge className={getTaskTypeBadgeColor(task.task_type)}>
                    {formatTaskType(task.task_type)}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="mt-1">
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {formatStatus(task.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                <p className="text-gray-700">{task.assignee_name || "Unassigned"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Property</Label>
                <p className="text-gray-700">{task.property_name || "No property"}</p>
              </div>
            </div>

            {task.due_date && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                <p className="text-gray-700">{format(parseISO(task.due_date), 'PPP')}</p>
              </div>
            )}

            {isAdmin && (
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Edit Mode - only shown to admins
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Task Type</Label>
                <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">To-Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign to Property</Label>
              <Select value={formData.property_id} onValueChange={(value) => setFormData({ ...formData, property_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP") : "Select date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
