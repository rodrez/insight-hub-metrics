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
      // Fetch all data
      const [projects, spis, sitreps, collaborators] = await Promise.all([
        db.getAllProjects(),
        db.getAllSPIs(),
        db.getAllSitReps(),
        db.getAllCollaborators()
      ]);

      const internalCollaborators = collaborators.filter(c => c.type === 'internal');
      
      if (internalCollaborators.length === 0) {
        toast({
          title: "Error",
          description: "No internal collaborators found to distribute items to",
          variant: "destructive",
        });
        return;
      }

      console.log(`Distributing ${projects.length} projects, ${spis.length} SPIs, and ${sitreps.length} sitreps among ${internalCollaborators.length} collaborators`);
      
      // Reset existing assignments
      for (const collaborator of internalCollaborators) {
        await db.updateCollaborator(collaborator.id, {
          assignedProjects: [],
          assignedSpis: [],
          assignedSitreps: []
        });
      }
      
      // Distribute items evenly across collaborators
      const distribution = internalCollaborators.map(collaborator => ({
        id: collaborator.id,
        assignedProjects: [] as string[],
        assignedSpis: [] as string[],
        assignedSitreps: [] as string[]
      }));

      // Helper function to distribute items
      const distributeItems = (items: any[], type: 'assignedProjects' | 'assignedSpis' | 'assignedSitreps') => {
        let currentIndex = 0;
        items.forEach(item => {
          distribution[currentIndex % distribution.length][type].push(item.id);
          currentIndex++;
        });
      };

      distributeItems(projects, 'assignedProjects');
      distributeItems(spis, 'assignedSpis');
      distributeItems(sitreps, 'assignedSitreps');

      // Save the distribution
      for (const position of distribution) {
        await db.updateCollaborator(position.id, {
          assignedProjects: position.assignedProjects,
          assignedSpis: position.assignedSpis,
          assignedSitreps: position.assignedSitreps
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