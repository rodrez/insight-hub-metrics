import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/lib/types/objective";
import { useState, useEffect } from "react";

interface ObjectiveEditDialogProps {
  objective: Objective | null;
  onClose: () => void;
  onSave: (objective: Objective) => void;
}

export function ObjectiveEditDialog({ objective, onClose, onSave }: ObjectiveEditDialogProps) {
  const [editedObjective, setEditedObjective] = useState<Objective | null>(null);

  useEffect(() => {
    if (objective) {
      const progress = objective.desiredOutcome.includes("%") ? 
        parseInt(objective.desiredOutcome) : 
        parseInt(objective.desiredOutcome.match(/\d+/)?.[0] || "0");
        
      setEditedObjective({
        ...objective,
        desiredOutcome: progress.toString()
      });
    }
  }, [objective]);

  if (!editedObjective) return null;

  const handleSave = () => {
    const updatedObjective = {
      ...editedObjective,
      desiredOutcome: `${editedObjective.desiredOutcome}%`
    };
    onSave(updatedObjective);
  };

  return (
    <Dialog open={!!objective} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {objective?.id ? 'Edit Objective' : 'Add New Objective'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedObjective.title}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedObjective.description}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="initiative">Initiative</Label>
            <Input
              id="initiative"
              value={editedObjective.initiative}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, initiative: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={editedObjective.desiredOutcome}
              onChange={(e) =>
                setEditedObjective({
                  ...editedObjective,
                  desiredOutcome: e.target.value
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}