import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Workstream } from "@/lib/types/collaboration";
import { CollaborationFormSchema, collaborationFormSchema } from "../CollaborationFormFields";

export function useWorkstreamActions(collaboratorId: string) {
  const queryClient = useQueryClient();
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

  return {
    form,
    handleDelete,
    handleEdit,
    onSubmit
  };
}