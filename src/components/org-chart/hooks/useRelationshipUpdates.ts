import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { OrgPosition } from "../types";

export function useRelationshipUpdates() {
  const handleSave = async (name: string, updatedPosition: OrgPosition) => {
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

      toast({
        title: "Success",
        description: "Relationships updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating relationships:', error);
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