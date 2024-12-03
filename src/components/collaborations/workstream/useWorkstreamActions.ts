import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Workstream } from "@/lib/types/collaboration";
import { CollaborationFormSchema, collaborationFormSchema } from "../form/types";

export function useWorkstreamActions(collaboratorId: string) {
  const queryClient = useQueryClient();
  const form = useForm<CollaborationFormSchema>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      type: "fortune30",
      color: "#4B5563",
      agreementType: "None",
      primaryContact: {
        name: "",
        role: "",
        email: "",
        phone: "",
      },
      workstreams: [],
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

      await db.updateCollaborator(collaboratorId, updatedCollaborator);
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

      const updatedWorkstreams = collaborator.workstreams?.map(w => 
        w.id === workstream.id ? workstream : w
      ) || [];

      const updatedCollaborator = {
        ...collaborator,
        workstreams: updatedWorkstreams
      };

      await db.updateCollaborator(collaboratorId, updatedCollaborator);
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

  const onSubmit = async (data: CollaborationFormSchema) => {
    try {
      const collaborator = await db.getCollaborator(collaboratorId);
      if (!collaborator) return;

      const updatedCollaborator = {
        ...collaborator,
        workstreams: data.workstreams?.map(ws => ({
          id: ws.id || `workstream-${Date.now()}`,
          title: ws.title,
          objectives: ws.objectives,
          nextSteps: ws.nextSteps,
          keyContacts: ws.keyContacts.map(contact => ({
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone || "",
          })),
          status: ws.status,
          startDate: ws.startDate,
          lastUpdated: ws.lastUpdated,
          ratMember: ws.ratMember || "",
        })) || []
      };

      await db.updateCollaborator(collaboratorId, updatedCollaborator);
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
