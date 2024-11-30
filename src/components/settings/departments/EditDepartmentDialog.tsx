import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Department } from "@/lib/types";

interface EditDepartmentDialogProps {
  department: Department | null;
  onClose: () => void;
  onSave: (department: Department) => void;
}

export function EditDepartmentDialog({
  department,
  onClose,
  onSave,
}: EditDepartmentDialogProps) {
  if (!department) return null;

  return (
    <Dialog open={!!department} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={department.name}
              onChange={(e) =>
                onSave({ ...department, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <Input
              type="color"
              value={department.color}
              onChange={(e) =>
                onSave({ ...department, color: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget</label>
            <Input
              type="number"
              value={department.budget}
              onChange={(e) =>
                onSave({ ...department, budget: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(department)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}