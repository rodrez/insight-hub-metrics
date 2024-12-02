import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Pencil, Trash2 } from "lucide-react";
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
import { CollaborationDialog } from '@/components/collaborations/CollaborationDialog';
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export default function InternalSupport() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editPartner, setEditPartner] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);

  const { data: partners = [], refetch } = useQuery({
    queryKey: ['internal-partners'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'internal');
    }
  });

  const handleDelete = async (id: string) => {
    setSelectedCollaborator(id);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      if (selectedCollaborator) {
        await db.deleteCollaborator(selectedCollaborator);
        toast({
          title: "Success",
          description: "Internal partner deleted successfully",
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete internal partner",
        variant: "destructive"
      });
    }
    setDeleteId(null);
  };

  const handleEdit = (id: string) => {
    setSelectedCollaborator(id);
    setShowEditDialog(true);
  };

  const handleSave = async (collaborator) => {
    try {
      await db.addCollaborator(collaborator);
      toast({
        title: "Success",
        description: "Internal partner saved successfully"
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save internal partner",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Internal Partners</h3>
        <Card>
          <div className="flex items-center justify-between">
            <Input placeholder="Search..." className="w-1/2" />
            <Button onClick={() => setShowEditDialog(true)}>
              <Pencil className="h-4 w-4 mr-2" /> Add Partner
            </Button>
          </div>
        </Card>
        {partners.map((partner) => (
          <Card key={partner.id} className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{partner.name}</h4>
              <p>{partner.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(partner.id)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(partner.id)}>Delete</Button>
            </div>
          </Card>
        ))}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the internal partner.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CollaborationDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleSave}
          collaboratorId={selectedCollaborator}
        />
      </div>
    </div>
  );
}
