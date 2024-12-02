import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

export function OrgChartDistributionAction({ disabled }: { disabled: boolean }) {
  const [isDistributing, setIsDistributing] = useState(false);

  const handleDistributeOrgChart = async () => {
    setIsDistributing(true);
    try {
      console.log('Starting org chart distribution...');
      
      // Fetch all data
      const [projects, spis, sitreps, collaborators, smePartners] = await Promise.all([
        db.getAllProjects(),
        db.getAllSPIs(),
        db.getAllSitReps(),
        db.getAllCollaborators(),
        db.getAllSMEPartners()
      ]);

      const internalCollaborators = collaborators.filter(c => c.type === 'internal');
      const fortune30Partners = collaborators.filter(c => c.type === 'fortune30');
      
      if (internalCollaborators.length === 0) {
        toast({
          title: "Error",
          description: "No internal collaborators found to distribute items to",
          variant: "destructive",
        });
        return;
      }

      console.log(`Distributing ${projects.length} projects, ${spis.length} SPIs, ${sitreps.length} sitreps, ${fortune30Partners.length} Fortune 30 partners, and ${smePartners.length} SME partners among ${internalCollaborators.length} collaborators`);
      
      // Reset existing assignments
      for (const collaborator of internalCollaborators) {
        await db.updateCollaborator(collaborator.id, {
          assignedProjects: [],
          assignedSpis: [],
          assignedSitreps: [],
          fortune30Partners: [],
          smePartners: []
        });
      }
      
      // Distribute items evenly across collaborators
      const distribution = internalCollaborators.map(collaborator => ({
        id: collaborator.id,
        assignedProjects: [] as string[],
        assignedSpis: [] as string[],
        assignedSitreps: [] as string[],
        fortune30Partners: [] as string[],
        smePartners: [] as string[]
      }));

      // Helper function to distribute items
      const distributeItems = (items: any[], type: 'assignedProjects' | 'assignedSpis' | 'assignedSitreps' | 'fortune30Partners' | 'smePartners') => {
        let currentIndex = 0;
        items.forEach(item => {
          distribution[currentIndex % distribution.length][type].push(item.id);
          currentIndex++;
        });
      };

      distributeItems(projects, 'assignedProjects');
      distributeItems(fortune30Partners, 'fortune30Partners');
      distributeItems(smePartners, 'smePartners');
      distributeItems(spis, 'assignedSpis');
      distributeItems(sitreps, 'assignedSitreps');

      // Save the distribution
      for (const position of distribution) {
        await db.updateCollaborator(position.id, {
          assignedProjects: position.assignedProjects,
          assignedSpis: position.assignedSpis,
          assignedSitreps: position.assignedSitreps,
          fortune30Partners: position.fortune30Partners,
          smePartners: position.smePartners
        });
      }

      toast({
        title: "Success",
        description: "Org chart data distributed successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to distribute org chart data";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <Button
      onClick={handleDistributeOrgChart}
      disabled={disabled || isDistributing}
    >
      {isDistributing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Distributing...
        </>
      ) : (
        "Distribute Org Chart"
      )}
    </Button>
  );
}