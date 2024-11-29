import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TechDomain } from "@/lib/types/techDomain";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditDomainDialogProps {
  domain: TechDomain | null;
  onClose: () => void;
  onUpdate: (domain: TechDomain) => void;
}

export function EditDomainDialog({ domain, onClose, onUpdate }: EditDomainDialogProps) {
  if (!domain) return null;

  return (
    <Dialog open={!!domain} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tech Domain</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-4">
            <Input
              placeholder="Domain Name"
              value={domain.name}
              onChange={e => onUpdate({ ...domain, name: e.target.value })}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={domain.color}
                onChange={e => onUpdate({ ...domain, color: e.target.value })}
                className="w-20 h-10"
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: domain.color }}
              />
            </div>
          </div>
          <Textarea
            placeholder="Description"
            value={domain.description}
            onChange={e => onUpdate({ ...domain, description: e.target.value })}
            className="h-20"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            onUpdate(domain);
            onClose();
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}