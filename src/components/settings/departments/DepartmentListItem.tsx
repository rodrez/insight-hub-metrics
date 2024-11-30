import { Department } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

interface DepartmentListItemProps {
  department: Department;
  onUpdate: (id: string, updates: Partial<Department>) => void;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

export function DepartmentListItem({
  department,
  onUpdate,
  onEdit,
  onDelete,
}: DepartmentListItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div
        className="w-6 h-6 rounded"
        style={{ backgroundColor: department.color }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Input
            value={department.name}
            onChange={(e) => onUpdate(department.id, { name: e.target.value })}
            className="max-w-[200px]"
          />
          <Input
            type="color"
            value={department.color}
            onChange={(e) => onUpdate(department.id, { color: e.target.value })}
            className="w-20 h-10"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(department)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(department.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Type: {department.type === 'business' ? 'Business Unit' : 'Functional Area'}
        </div>
      </div>
    </div>
  );
}