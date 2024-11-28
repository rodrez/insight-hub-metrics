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
    if (!isInitialized) return;
    
    try {
      const projects = await db.getAllProjects();
      const spis = await db.getAllSPIs();
      const objectives = await db.getAllObjectives();
      const sitreps = await db.getAllSitReps();
      const collaborators = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();

      console.log('SME Partners count:', smePartners?.length || 0);

      setDataCounts({
        projects: projects?.length || 0,
        spis: spis?.length || 0,
        objectives: objectives?.length || 0,
        sitreps: sitreps?.length || 0,
        fortune30: collaborators?.filter(c => c.type === 'fortune30')?.length || 0,
        internalPartners: collaborators?.filter(c => c.type === 'other')?.length || 0,
        smePartners: smePartners?.length || 0
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