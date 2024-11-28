import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddMilestoneDialogProps {
  onAdd: (milestone: { title: string; description: string; dueDate: string }) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function AddMilestoneDialog({ onAdd, onOpenChange, open }: AddMilestoneDialogProps) {
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleAdd = () => {
    onAdd(newMilestone);
    setNewMilestone({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Milestone</AlertDialogTitle>
          <AlertDialogDescription>
            Create a new milestone for this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Milestone Title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
          />
          <Input
            type="date"
            value={newMilestone.dueDate}
            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAdd}>Add Milestone</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}