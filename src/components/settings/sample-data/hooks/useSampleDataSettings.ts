import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { DataCounts } from "@/components/data/types/dataTypes";

export function useSampleDataSettings() {
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [generatedCounts, setGeneratedCounts] = useState<DataCounts | null>(null);

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await db.init();
      setGeneratedCounts(null);
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const populateDatabase = async () => {
    setIsPopulating(true);
    try {
      const quantities = {
        projects: 5,
        fortune30: 6,
        internalPartners: 20,
        smePartners: 6,
        spis: 10,
        objectives: 5,
        sitreps: 10
      };

      await db.populateSampleData(quantities);
      
      const counts: DataCounts = {
        projects: (await db.getAllProjects()).length,
        spis: (await db.getAllSPIs()).length,
        objectives: (await db.getAllObjectives()).length,
        sitreps: (await db.getAllSitReps()).length,
        fortune30: (await db.getAllCollaborators()).filter(c => c.type === 'fortune30').length,
        internalPartners: (await db.getAllCollaborators()).filter(c => c.type === 'internal').length,
        smePartners: (await db.getAllSMEPartners()).length
      };

      setGeneratedCounts(counts);
      toast({
        title: "Success",
        description: "Sample data generated successfully",
      });
    } catch (error) {
      console.error('Error populating database:', error);
      toast({
        title: "Error",
        description: "Failed to populate database",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return {
    isClearing,
    isPopulating,
    generatedCounts,
    clearDatabase,
    populateDatabase
  };
}