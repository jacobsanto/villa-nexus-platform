
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddTaskForm } from "@/hooks/useAddTaskForm";
import TaskFormFields from "./TaskFormFields";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTaskModal = ({ isOpen, onClose, onSuccess }: AddTaskModalProps) => {
  const {
    loading,
    properties,
    teamMembers,
    formData,
    setFormData,
    handleSubmit,
    handleClose
  } = useAddTaskForm(isOpen, onSuccess, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskFormFields
            formData={formData}
            setFormData={setFormData}
            properties={properties}
            teamMembers={teamMembers}
          />

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
