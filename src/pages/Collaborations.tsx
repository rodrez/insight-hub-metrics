import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { collaborators } from '@/lib/data/collaborators';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export default function Collaborations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);

  const fortune30Collaborators = collaborators.filter(c => c.type === 'fortune30');
  const otherCollaborators = collaborators.filter(c => c.type !== 'fortune30');

  const handleDelete = (id: string) => {
    setSelectedCollaborator(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Implement delete logic here
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
            <div className="grid gap-6">
              {fortune30Collaborators.map((collaborator) => (
                <Card key={collaborator.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{collaborator.name}</CardTitle>
                        <CardDescription>{collaborator.role}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(collaborator.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(collaborator.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Agreement Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <Badge>{collaborator.agreements?.type || 'None'}</Badge>
                            </div>
                            {collaborator.agreements?.signedDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Signed:</span>
                                <span>{new Date(collaborator.agreements.signedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {collaborator.agreements?.expiryDate && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Expires:</span>
                                <span>{new Date(collaborator.agreements.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Contact</h4>
                          <a 
                            href={`mailto:${collaborator.email}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Mail className="h-4 w-4" />
                            {collaborator.email}
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Associated Projects</h4>
                        <div className="space-y-2">
                          {collaborator.projects.map((project, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                              <span>{project}</span>
                              <Badge variant="outline">Active</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherCollaborators.map((collaborator) => (
                    <TableRow key={collaborator.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{collaborator.name}</TableCell>
                      <TableCell>{collaborator.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{collaborator.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {collaborator.projects.map((project, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(collaborator.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`mailto:${collaborator.email}`}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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