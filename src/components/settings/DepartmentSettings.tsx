import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Department } from "@/lib/types";

export function DepartmentSettings() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'airplanes',
      name: 'Airplanes',
      type: 'business',
      color: '#3B82F6',
      projectCount: 2,
      budget: 500000
    },
    {
      id: 'helicopters',
      name: 'Helicopters',
      type: 'business',
      color: '#10B981',
      projectCount: 2,
      budget: 400000
    },
    {
      id: 'space',
      name: 'Space',
      type: 'business',
      color: '#8B5CF6',
      projectCount: 1,
      budget: 300000
    },
    {
      id: 'energy',
      name: 'Energy',
      type: 'business',
      color: '#F97316',
      projectCount: 2,
      budget: 300000
    },
    {
      id: 'it',
      name: 'IT',
      type: 'functional',
      color: '#06B6D4',
      projectCount: 2,
      budget: 300000
    },
    {
      id: 'techlab',
      name: 'Tech Lab',
      type: 'functional',
      color: '#EAB308',
      projectCount: 1,
      budget: 200000
    }
  ]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const handleUpdate = (id: string, updates: Partial<Department>) => {
    setDepartments(deps => 
      deps.map(d => d.id === id ? { ...d, ...updates } : d)
    );
    toast({
      title: "Success",
      description: "Department updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    setDepartments(deps => deps.filter(d => d.id !== id));
    setDeleteId(null);
    toast({
      title: "Success",
      description: "Department deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Business Units & Functional Areas</h3>
        <div className="grid gap-4">
          {departments.map(dept => (
            <div key={dept.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: dept.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={dept.name}
                    onChange={(e) => handleUpdate(dept.id, { name: e.target.value })}
                    className="max-w-[200px]"
                  />
                  <Input
                    type="color"
                    value={dept.color}
                    onChange={(e) => handleUpdate(dept.id, { color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(dept.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Type: {dept.type === 'business' ? 'Business Unit' : 'Functional Area'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}