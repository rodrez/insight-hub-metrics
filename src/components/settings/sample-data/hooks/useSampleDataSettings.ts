import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { DataCounts, DataQuantities } from "@/components/data/types/dataTypes";

export function useSampleDataSettings() {
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [quantities, setQuantities] = useState<DataQuantities>({
    projects: 5,
    fortune30: 5,
    internalPartners: 20,
    smePartners: 10,
    spis: 5,
    objectives: 3,
    sitreps: 5
  });
  const [generatedCounts, setGeneratedCounts] = useState<DataCounts | null>(null);

  const updateQuantity = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [key]: numValue }));
  };

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

      const mismatches = Object.entries(counts).filter(
        ([key, count]) => count !== quantities[key as keyof typeof quantities]
      );

      if (mismatches.length > 0) {
        toast({
          title: "Warning",
          description: "Some data quantities don't match requested amounts. Check the generated counts.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sample data generated successfully with requested quantities",
        });
      }
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
    quantities,
    generatedCounts,
    updateQuantity,
    clearDatabase,
    populateDatabase
  };
}