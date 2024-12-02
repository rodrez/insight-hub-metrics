import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface Initiative {
  id: string;
  initiative: string;
  desiredOutcome: string;
  objectiveIds: string[];
}

interface Objective {
  id: string;
  title: string;
  desiredOutcome: string;
}

interface InitiativeEditDialogProps {
  initiative: Initiative | null;
  objectives: Objective[];
  onClose: () => void;
  onSave: (initiative: Initiative) => void;
}

export function InitiativeEditDialog({
  initiative,
  objectives,
  onClose,
  onSave,
}: InitiativeEditDialogProps) {
  const [editedInitiative, setEditedInitiative] = useState<Initiative | null>(null);

  useEffect(() => {
    if (initiative) {
      setEditedInitiative(initiative);
    }
  }, [initiative]);

  if (!editedInitiative) return null;

  const handleSave = () => {
    onSave(editedInitiative);
  };

  const toggleObjective = (objectiveId: string) => {
    setEditedInitiative(prev => {
      if (!prev) return prev;
      const newObjectiveIds = prev.objectiveIds.includes(objectiveId)
        ? prev.objectiveIds.filter(id => id !== objectiveId)
        : [...prev.objectiveIds, objectiveId];
      return { ...prev, objectiveIds: newObjectiveIds };
    });
  };

  return (
    <Dialog open={!!initiative} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Initiative</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              value={editedInitiative.initiative}
              onChange={(e) =>
                setEditedInitiative({ ...editedInitiative, initiative: e.target.value })
              }
              placeholder="Initiative name"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              value={editedInitiative.desiredOutcome}
              onChange={(e) =>
                setEditedInitiative({ ...editedInitiative, desiredOutcome: e.target.value })
              }
              placeholder="Desired outcome"
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Aligned Objectives</h4>
            {objectives.map((objective) => (
              <div key={objective.id} className="flex items-center space-x-2">
                <Checkbox
                  id={objective.id}
                  checked={editedInitiative.objectiveIds.includes(objective.id)}
                  onCheckedChange={() => toggleObjective(objective.id)}
                />
                <label htmlFor={objective.id} className="text-sm">
                  {objective.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}