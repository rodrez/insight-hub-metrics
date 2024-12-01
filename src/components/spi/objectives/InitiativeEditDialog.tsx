import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface InitiativeEditDialogProps {
  initiative: {
    id: string;
    initiative: string;
    desiredOutcome: string;
  } | null;
  onClose: () => void;
  onSave: (initiative: {
    id: string;
    initiative: string;
    desiredOutcome: string;
  }) => void;
}

export function InitiativeEditDialog({
  initiative,
  onClose,
  onSave,
}: InitiativeEditDialogProps) {
  const [editedInitiative, setEditedInitiative] = useState({
    id: "",
    initiative: "",
    desiredOutcome: "",
  });

  useEffect(() => {
    if (initiative) {
      setEditedInitiative(initiative);
    }
  }, [initiative]);

  const handleSave = () => {
    onSave(editedInitiative);
  };

  return (
    <Dialog open={!!initiative} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Initiative</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initiative">Initiative</Label>
            <Input
              id="initiative"
              value={editedInitiative.initiative}
              onChange={(e) =>
                setEditedInitiative({
                  ...editedInitiative,
                  initiative: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="outcome">Desired Outcome</Label>
            <Textarea
              id="outcome"
              value={editedInitiative.desiredOutcome}
              onChange={(e) =>
                setEditedInitiative({
                  ...editedInitiative,
                  desiredOutcome: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}