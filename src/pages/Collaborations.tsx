import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CollaborationDialog } from '@/components/collaborations/CollaborationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from 'react-router-dom';
import { collaborators } from '@/lib/data/collaborators';
import { Fortune30List } from '@/components/collaborations/Fortune30List';
import { OtherPartnersList } from '@/components/collaborations/OtherPartnersList';

export default function Collaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);
  const location = useLocation();

  const fortune30Collaborators = collaborators.filter(c => c.type === 'fortune30');
  const otherCollaborators = collaborators.filter(c => c.type !== 'fortune30');

  const handleDelete = (id: string) => {
    setSelectedCollaborator(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    toast({
      title: "Collaboration deleted",
      description: "The collaboration has been successfully removed.",
    });
    setShowDeleteDialog(false);
  };

  const handleEdit = (id: string) => {
    setSelectedCollaborator(id);
    setShowEditDialog(true);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Collaborations</h1>
          <div className="flex gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collaborators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowEditDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Collaboration
            </Button>
          </div>
        </div>

        <Tabs defaultValue="fortune30" className="w-full">
          <TabsList>
            <TabsTrigger value="fortune30">Fortune 30</TabsTrigger>
            <TabsTrigger value="other">Internal Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="fortune30">
            <Fortune30List 
              collaborators={fortune30Collaborators}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="other">
            <OtherPartnersList collaborators={otherCollaborators} />
          </TabsContent>
        </Tabs>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the collaboration
                and remove the data from our servers.
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
        />
      </div>
    </div>
  );
}