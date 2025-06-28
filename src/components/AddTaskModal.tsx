
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Property, UserProfile } from "@/types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTaskModal = ({ isOpen, onClose, onSuccess }: AddTaskModalProps) => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_id: "",
    assigned_to: "",
    due_date: undefined as Date | undefined,
    task_type: "general"
  });

  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && profile?.tenant_id) {
      fetchProperties();
      fetchTeamMembers();
    }
  }, [isOpen, profile?.tenant_id]);

  const fetchProperties = async () => {
    if (!profile?.tenant_id) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('name');

      if (error) throw error;
      setProperties(data || []);
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
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.tenant_id) {
      toast({
        title: "Error",
        description: "No tenant ID found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        property_id: formData.property_id || null,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null,
        task_type: formData.task_type,
        tenant_id: profile.tenant_id,
        status: 'to-do'
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        property_id: "",
        assigned_to: "",
        due_date: undefined,
        task_type: "general"
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      property_id: "",
      assigned_to: "",
      due_date: undefined,
      task_type: "general"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
