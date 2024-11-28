import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { DataCounts } from "../types/dataTypes";
import { toast } from "@/components/ui/use-toast";

export function useDataCounts(isInitialized: boolean) {
  const [dataCounts, setDataCounts] = useState<DataCounts>({
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  });

  const updateDataCounts = async () => {
    try {
      const projects = await db.getAllProjects();
      const spis = await db.getAllSPIs();
      const objectives = await db.getAllObjectives();
      const sitreps = await db.getAllSitReps();
      const collaborators = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();

      setDataCounts({
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        sitreps: sitreps.length,
        fortune30: collaborators.filter(c => c.type === 'fortune30').length,
        internalPartners: collaborators.filter(c => c.type === 'other').length,
        smePartners: smePartners.length
      });
    } catch (error) {
      console.error('Error updating data counts:', error);
      toast({
        title: "Error",
        description: "Failed to update data counts",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isInitialized) {
      updateDataCounts();
    }
  }, [isInitialized]);

  return { dataCounts, updateDataCounts };
}