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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Department } from "@/lib/types";
import { Info, Pencil, Trash2 } from "lucide-react";

const DEPARTMENT_DESCRIPTIONS = {
  airplanes: "Focuses on commercial and military aircraft development and innovation",
  helicopters: "Specializes in rotorcraft technology and vertical lift solutions",
  space: "Develops space exploration and satellite technologies",
  energy: "Works on sustainable energy solutions and power systems",
  it: "Provides technical infrastructure and digital solutions",
  techlab: "Conducts research and development in emerging technologies"
};

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
        
        {/* Color Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg">
          {departments.map(dept => (
            <TooltipProvider key={dept.id}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-sm">{dept.name}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{DEPARTMENT_DESCRIPTIONS[dept.id as keyof typeof DEPARTMENT_DESCRIPTIONS]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

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
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingDept(dept)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(dept.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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

      <Dialog open={!!editingDept} onOpenChange={() => setEditingDept(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDept && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={editingDept.color}
                  onChange={(e) => setEditingDept({ ...editingDept, color: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget</label>
                <Input
                  type="number"
                  value={editingDept.budget}
                  onChange={(e) => setEditingDept({ ...editingDept, budget: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDept(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editingDept) {
                handleUpdate(editingDept.id, editingDept);
                setEditingDept(null);
              }
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}