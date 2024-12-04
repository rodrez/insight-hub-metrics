import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { OrgPosition } from "../types";
import { useQueryClient } from "@tanstack/react-query";

export function useRelationshipUpdates() {
  const queryClient = useQueryClient();

  const handleSave = async (name: string, updatedPosition: OrgPosition) => {
    // Store previous data for rollback
    const previousData = {
      projects: await queryClient.getQueryData(['projects', name]),
      collaborators: await queryClient.getQueryData(['collaborators', name]),
      smePartners: await queryClient.getQueryData(['sme-partners', name]),
      spis: await queryClient.getQueryData(['spis', name]),
      sitreps: await queryClient.getQueryData(['sitreps', name])
    };

    // Optimistically update UI
    queryClient.setQueryData(['projects', name], 
      (old: any[]) => old?.filter(p => updatedPosition.projects.includes(p.id)));
    queryClient.setQueryData(['collaborators', name], 
      (old: any[]) => old?.filter(c => updatedPosition.fortune30Partners.includes(c.id)));
    queryClient.setQueryData(['sme-partners', name], 
      (old: any[]) => old?.filter(p => updatedPosition.smePartners.includes(p.id)));
    queryClient.setQueryData(['spis', name], 
      (old: any[]) => old?.filter(s => updatedPosition.spis.includes(s.id)));
    queryClient.setQueryData(['sitreps', name], 
      (old: any[]) => old?.filter(s => updatedPosition.sitreps.includes(s.id)));

    try {
      const promises = [];
      
      // Update projects
      for (const projectId of updatedPosition.projects) {
        promises.push(db.updateProject(projectId, { ratMember: name }));
      }

      // Update Fortune 30 partners
      for (const partnerId of updatedPosition.fortune30Partners) {
        promises.push(db.updateCollaborator(partnerId, { ratMember: name }));
      }

      // Update SME partners
      for (const partnerId of updatedPosition.smePartners) {
        promises.push(db.updateSMEPartner(partnerId, { ratMember: name }));
      }

      // Update SPIs
      for (const spiId of updatedPosition.spis) {
        promises.push(db.updateSPI(spiId, { ratMember: name }));
      }

      // Update SitReps
      for (const sitrepId of updatedPosition.sitreps) {
        promises.push(db.updateSitRep(sitrepId, { ratMember: name }));
      }

      await Promise.all(promises);

      // Invalidate and refetch affected queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['collaborators'] }),
        queryClient.invalidateQueries({ queryKey: ['sme-partners'] }),
        queryClient.invalidateQueries({ queryKey: ['spis'] }),
        queryClient.invalidateQueries({ queryKey: ['sitreps'] })
      ]);

      toast({
        title: "Success",
        description: "Relationships updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating relationships:', error);
      
      // Rollback optimistic updates on error
      queryClient.setQueryData(['projects', name], previousData.projects);
      queryClient.setQueryData(['collaborators', name], previousData.collaborators);
      queryClient.setQueryData(['sme-partners', name], previousData.smePartners);
      queryClient.setQueryData(['spis', name], previousData.spis);
      queryClient.setQueryData(['sitreps', name], previousData.sitreps);

      toast({
        title: "Error",
        description: "Failed to update relationships",
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleSave };
}