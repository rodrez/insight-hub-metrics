import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { DepartmentColorLegend } from "./departments/DepartmentColorLegend";
import { DepartmentListItem } from "./departments/DepartmentListItem";
import { EditDepartmentDialog } from "./departments/EditDepartmentDialog";

const DEPARTMENT_DESCRIPTIONS = {
  airplanes: "Focuses on commercial and military aircraft development and innovation",
  helicopters: "Specializes in rotorcraft technology and vertical lift solutions",
  space: "Develops space exploration and satellite technologies",
  energy: "Works on sustainable energy solutions and power systems",
  it: "Provides technical infrastructure and digital solutions",
  techlab: "Conducts research and development in emerging technologies"
};

const defaultDepartments: Department[] = [
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
];

export function DepartmentSettings() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const queryClient = useQueryClient();

  // Query for fetching departments
  const { data: departments = defaultDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => {
      const savedDepartments = localStorage.getItem('departments');
      return savedDepartments ? JSON.parse(savedDepartments) : defaultDepartments;
    },
  });

  // Mutation for updating departments
  const updateMutation = useMutation({
    mutationFn: async (updatedDepartments: Department[]) => {
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      return updatedDepartments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (id: string, updates: Partial<Department>) => {
    const updatedDepartments = departments.map(d => 
      d.id === id ? { ...d, ...updates } : d
    );
    updateMutation.mutate(updatedDepartments);
  };

  const handleDelete = (id: string) => {
    const updatedDepartments = departments.filter(d => d.id !== id);
    updateMutation.mutate(updatedDepartments);
    setDeleteId(null);
  };

  const handleSave = (updatedDept: Department) => {
    const updatedDepartments = departments.map(d => 
      d.id === updatedDept.id ? updatedDept : d
    );
    updateMutation.mutate(updatedDepartments);
    setEditingDept(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Business Units & Functional Areas</h3>
        
        <DepartmentColorLegend 
          departments={departments}
          descriptions={DEPARTMENT_DESCRIPTIONS}
        />

        <div className="grid gap-4">
          {departments.map(dept => (
            <DepartmentListItem
              key={dept.id}
              department={dept}
              onUpdate={handleUpdate}
              onEdit={setEditingDept}
              onDelete={(id) => setDeleteId(id)}
            />
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

      <EditDepartmentDialog
        department={editingDept}
        onClose={() => setEditingDept(null)}
        onSave={handleSave}
      />
    </div>
  );
}