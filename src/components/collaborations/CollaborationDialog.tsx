import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CollaborationFormFields } from "./CollaborationFormFields";
import { CollaborationType } from "@/lib/types";

export interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId?: string | null;
  departmentId?: string;
  collaborationType?: CollaborationType;
}

export function CollaborationDialog({ 
  open, 
  onOpenChange, 
  collaboratorId,
  departmentId,
  collaborationType = 'fortune30'
}: CollaborationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <CollaborationFormFields
          collaboratorId={collaboratorId}
          departmentId={departmentId}
          collaborationType={collaborationType}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}