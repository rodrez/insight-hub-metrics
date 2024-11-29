import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CollaborationDialog } from '@/components/collaborations/CollaborationDialog';
import { toast } from "@/components/ui/use-toast";
import { SMEList } from '@/components/collaborations/SMEList';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';

export default function SME() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);

  const { data: collaborators = [], isLoading } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: async () => {
      const smePartners = await db.getAllSMEPartners();
      if (smePartners && smePartners.length > 0) {
        return smePartners;
      }
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'sme');
    },
  });

  const handleDelete = async (id: string) => {
    setSelectedCollaborator(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      toast({
        title: "Small Medium Enterprise partnership deleted",
        description: "The SME partnership has been successfully removed.",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete SME partnership",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    setSelectedCollaborator(id);
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-16 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Small Medium Enterprise Partnerships...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Small Medium Enterprise Partnerships</h1>
            <p className="text-muted-foreground mt-1">
              Manage partnerships with small and medium-sized enterprises
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SME partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setShowEditDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New SME Partnership
            </Button>
          </div>
        </div>

        <SMEList 
          collaborators={collaborators}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the SME partnership
                and remove all associated data from our records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CollaborationDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          collaboratorId={selectedCollaborator}
          collaborationType="sme"
        />
      </div>
    </div>
  );
}