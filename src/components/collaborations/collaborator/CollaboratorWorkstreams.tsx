import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { Workstream } from "@/lib/types/collaboration";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkstreamFields } from "../form/WorkstreamFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CollaborationFormSchema, formSchema } from "../CollaborationFormFields";

type CollaboratorWorkstreamsProps = {
  workstreams?: Workstream[];
  collaboratorId: string;
};

export function CollaboratorWorkstreams({ workstreams, collaboratorId }: CollaboratorWorkstreamsProps) {
  const queryClient = useQueryClient();
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workstreams: []
    }
  });
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async (workstreamId: string) => {
    try {
      const collaborator = await db.getCollaborator(collaboratorId);
      if (!collaborator) return;

      const updatedCollaborator = {
        ...collaborator,
        workstreams: collaborator.workstreams?.filter(w => w.id !== workstreamId) || []
      };

      await db.addCollaborator(updatedCollaborator);
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      
      toast({
        title: "Workstream deleted",
        description: "The workstream has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workstream",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (workstream: Workstream) => {
    try {
      const collaborator = await db.getCollaborator(collaboratorId);
      if (!collaborator) return;

      form.reset({
        workstreams: [{
          id: workstream.id,
          title: workstream.title,
          objectives: workstream.objectives,
          nextSteps: workstream.nextSteps,
          keyContacts: workstream.keyContacts,
          status: workstream.status,
          startDate: workstream.startDate,
          lastUpdated: workstream.lastUpdated
        }]
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workstream data",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: CollaborationFormSchema) => {
    try {
      const collaborator = await db.getCollaborator(collaboratorId);
      if (!collaborator) return;

      const updatedWorkstream = data.workstreams?.[0];
      if (!updatedWorkstream) return;

      const newWorkstream: Workstream = {
        id: updatedWorkstream.id,
        title: updatedWorkstream.title,
        objectives: updatedWorkstream.objectives,
        nextSteps: updatedWorkstream.nextSteps,
        keyContacts: updatedWorkstream.keyContacts || [],
        status: updatedWorkstream.status,
        startDate: updatedWorkstream.startDate,
        lastUpdated: new Date().toISOString()
      };

      const updatedWorkstreams = collaborator.workstreams?.map(w => 
        w.id === newWorkstream.id ? newWorkstream : w
      ) || [];

      await db.addCollaborator({
        ...collaborator,
        workstreams: updatedWorkstreams
      });

      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      
      toast({
        title: "Success",
        description: "Workstream updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workstream",
        variant: "destructive",
      });
    }
  };

  if (!workstreams?.length) {
    return (
      <div>
        <h4 className="font-medium mb-4">Workstreams</h4>
        <p className="text-sm text-muted-foreground">No workstreams defined</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-4">Workstreams</h4>
      <div className="space-y-4">
        {workstreams.map((workstream) => (
          <Card key={workstream.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-medium">{workstream.title}</h5>
                  <Badge variant={
                    workstream.status === 'active' ? 'default' :
                    workstream.status === 'completed' ? 'secondary' :
                    'outline'
                  }>
                    {workstream.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(workstream)}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Workstream</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                          <WorkstreamFields form={form} />
                          <Button type="submit">Save Changes</Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(workstream.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Objectives:</p>
                  <p className="text-muted-foreground">{workstream.objectives}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Next Steps:</p>
                  <p className="text-muted-foreground">{workstream.nextSteps}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {formatDate(workstream.lastUpdated)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}