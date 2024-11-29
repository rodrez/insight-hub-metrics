import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
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
import { TechDomain, defaultTechDomains } from "@/lib/types/techDomain";
import { AddTechDomain } from "./tech-domain/AddTechDomain";
import { DomainList } from "./tech-domain/DomainList";
import { EditDomainDialog } from "./tech-domain/EditDomainDialog";

export function TechDomainSettings() {
  const [domains, setDomains] = useState<TechDomain[]>(defaultTechDomains);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editDomain, setEditDomain] = useState<TechDomain | null>(null);

  const handleAdd = (newDomain: TechDomain) => {
    setDomains([...domains, newDomain]);
    toast({
      title: "Success",
      description: "Tech domain added successfully",
    });
  };

  const handleDelete = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    setDeleteId(null);
    toast({
      title: "Success",
      description: "Tech domain deleted successfully",
    });
  };

  const handleUpdate = (updatedDomain: TechDomain) => {
    setDomains(domains.map(d => d.id === updatedDomain.id ? updatedDomain : d));
    setEditDomain(null);
    toast({
      title: "Success",
      description: "Tech domain updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <AddTechDomain onAdd={handleAdd} />
      <DomainList
        domains={domains}
        onEdit={setEditDomain}
        onDelete={setDeleteId}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tech domain.
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

      <EditDomainDialog
        domain={editDomain}
        onClose={() => setEditDomain(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}