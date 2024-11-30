import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Workstream, Agreement } from "@/lib/types/collaboration";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollaborationFormSchema, collaborationFormSchema } from "../CollaborationFormFields";
import { WorkstreamActions } from "../workstream/WorkstreamActions";
import { WorkstreamCard } from "../shared/WorkstreamCard";
import { useAgreementStatus } from "@/hooks/useAgreementStatus";

type CollaboratorWorkstreamsProps = {
  workstreams?: Workstream[];
  collaboratorId: string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};

export function CollaboratorWorkstreams({ workstreams, collaboratorId, agreements }: CollaboratorWorkstreamsProps) {
  const queryClient = useQueryClient();
  const { formatDate } = useAgreementStatus(agreements);
  
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      workstreams: []
    }
  });

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
          keyContacts: workstream.keyContacts.map(contact => ({
            name: contact.name,
            email: contact.email,
            role: contact.role,
            phone: contact.phone || ''
          })),
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
        keyContacts: updatedWorkstream.keyContacts.map(contact => ({
          name: contact.name,
          email: contact.email,
          role: contact.role,
          phone: contact.phone || ''
        })),
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
              <WorkstreamCard
                workstream={workstream}
                formatDate={formatDate}
                agreements={agreements}
              />
              <WorkstreamActions
                workstream={workstream}
                form={form}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}