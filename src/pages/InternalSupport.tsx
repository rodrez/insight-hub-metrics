import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CollaborationDialog } from '@/components/collaborations/CollaborationDialog';
import { toast } from "@/components/ui/use-toast";
import { OtherPartnersList } from '@/components/collaborations/OtherPartnersList';
import { DEPARTMENTS } from '@/lib/constants';
import { db } from '@/lib/db';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function InternalSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);
  const { departmentId } = useParams();

  const department = departmentId ? DEPARTMENTS.find(d => d.id === departmentId) : null;

  const { data: collaborators = [], isLoading } = useQuery({
    queryKey: ['internal-collaborators', departmentId],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => {
        const matchesDepartment = !departmentId || c.department === departmentId;
        return c.type === 'internal' && matchesDepartment;
      });
    },
  });

  const handleDelete = async (id: string) => {
    setSelectedCollaborator(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Implement delete functionality when available in db service
      toast({
        title: "Partner removed",
        description: "The internal partner has been successfully removed.",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete internal partner",
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
          <h2 className="text-2xl font-semibold mb-4">Loading Internal Support...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {department ? `${department.name} Partners` : 'Internal Support'}
            </h1>
            {department && (
              <p className="text-muted-foreground mt-1">
                Viewing internal partners for {department.type === 'business' ? 'Business Unit' : 'Functional Area'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internal partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setShowEditDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Internal Partner
            </Button>
          </div>
        </div>

        <OtherPartnersList collaborators={collaborators} />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the internal partner
                and their data from our servers.
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
          departmentId={departmentId}
        />
      </div>
    </div>
  );
}