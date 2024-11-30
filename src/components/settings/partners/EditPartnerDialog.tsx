import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collaborator } from "@/lib/types/collaboration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditPartnerDialogProps {
  partner: Collaborator | null;
  onClose: () => void;
  onUpdate: (partner: Collaborator) => void;
}

export function EditPartnerDialog({ partner, onClose, onUpdate }: EditPartnerDialogProps) {
  if (!partner) return null;

  return (
    <Dialog open={!!partner} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Partner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-4">
            <Input
              placeholder="Partner Name"
              value={partner.name}
              onChange={e => onUpdate({ ...partner, name: e.target.value })}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={partner.color}
                onChange={e => onUpdate({ ...partner, color: e.target.value })}
                className="w-20 h-10"
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: partner.color }}
              />
            </div>
          </div>
          <Input
            placeholder="Role"
            value={partner.role}
            onChange={e => onUpdate({ ...partner, role: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            onUpdate(partner);
            onClose();
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}