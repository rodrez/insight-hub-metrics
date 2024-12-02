import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/lib/types/objective";
import { useState, useEffect } from "react";

interface ObjectiveEditDialogProps {
  objective: Objective | null;
  onClose: () => void;
  onSave: (objective: Objective) => Promise<void>;
}

export function ObjectiveEditDialog({ objective, onClose, onSave }: ObjectiveEditDialogProps) {
  const [editedObjective, setEditedObjective] = useState<Objective | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (objective) {
      const progress = objective.desiredOutcome.includes("%") ? 
        objective.desiredOutcome.replace("%", "") : 
        objective.desiredOutcome.match(/\d+/)?.[0] || "0";
        
      setEditedObjective({
        ...objective,
        desiredOutcome: progress
      });
    }
  }, [objective]);

  if (!editedObjective) return null;

  const handleSave = async () => {
    if (isSaving || !editedObjective) return;
    
    try {
      setIsSaving(true);
      const updatedObjective = {
        ...editedObjective,
        desiredOutcome: `${editedObjective.desiredOutcome}%`
      };
      await onSave(updatedObjective);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={!!objective} onOpenChange={() => !isSaving && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Objective</DialogTitle>
          <DialogDescription>
            Make changes to your objective here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              value={editedObjective.title}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, title: e.target.value })
              }
              placeholder="Title"
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              value={editedObjective.description}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>
          <div className="grid gap-2">
            <Input
              value={editedObjective.initiative}
              onChange={(e) =>
                setEditedObjective({ ...editedObjective, initiative: e.target.value })
              }
              placeholder="Initiative"
            />
          </div>
          <div className="grid gap-2">
            <Input
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
              placeholder="Progress (%)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}