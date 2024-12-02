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
import { Objective } from "@/lib/types/objective";

interface Initiative {
  id: string;
  initiative: string;
  desiredOutcome: string;
  objectiveIds: string[];
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
  const [editedInitiative, setEditedInitiative] = useState<Initiative>({
    id: '',
    initiative: '',
    desiredOutcome: '',
    objectiveIds: [],
  });

  useEffect(() => {
    if (initiative) {
      setEditedInitiative(initiative);
    }
  }, [initiative]);

  const handleSave = () => {
    onSave(editedInitiative);
  };

  const handleObjectiveToggle = (objectiveId: string) => {
    setEditedInitiative(prev => {
      const newObjectiveIds = prev.objectiveIds.includes(objectiveId)
        ? prev.objectiveIds.filter(id => id !== objectiveId)
        : [...prev.objectiveIds, objectiveId];
      
      return {
        ...prev,
        objectiveIds: newObjectiveIds,
      };
    });
  };

  return (
    <Dialog open={!!initiative} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initiative?.id ? 'Edit' : 'Add'} Initiative</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Initiative name"
              value={editedInitiative.initiative}
              onChange={(e) =>
                setEditedInitiative((prev) => ({
                  ...prev,
                  initiative: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Desired outcome"
              value={editedInitiative.desiredOutcome}
              onChange={(e) =>
                setEditedInitiative((prev) => ({
                  ...prev,
                  desiredOutcome: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Aligned Objectives</h4>
            <div className="space-y-2">
              {objectives.map((objective) => (
                <div key={objective.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={objective.id}
                    checked={editedInitiative.objectiveIds.includes(objective.id)}
                    onCheckedChange={() => handleObjectiveToggle(objective.id)}
                  />
                  <label
                    htmlFor={objective.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {objective.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}