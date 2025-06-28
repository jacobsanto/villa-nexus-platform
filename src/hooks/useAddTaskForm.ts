
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Property, UserProfile } from "@/types";
import { format } from "date-fns";

export const useAddTaskForm = (isOpen: boolean, onSuccess: () => void, onClose: () => void) => {
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

      resetForm();
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      property_id: "",
      assigned_to: "",
      due_date: undefined,
      task_type: "general"
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    loading,
    properties,
    teamMembers,
    formData,
    setFormData,
    handleSubmit,
    handleClose
  };
};
