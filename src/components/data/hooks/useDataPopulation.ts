import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep } from "@/lib/utils/loadingRetry";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";
import { DataQuantities } from "../SampleData";
import { toast } from "@/components/ui/use-toast";
import { generateSampleData } from "@/lib/services/data/sampleDataGenerator";
import { generateInternalPartners } from "@/lib/services/data/generators/internalPartnersGenerator";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const databaseOps = new DatabaseOperations();

  const populateSampleData = async (quantities: DataQuantities) => {
    setIsPopulating(true);
    setProgress(0);
    
    try {
      console.log('Starting sample data population with quantities:', quantities);
      
      // Initialize database
      await db.init();
      setProgress(10);
      
      // Clear existing data
      await db.clear();
      setProgress(20);
      
      // Generate internal partners first
      const internalPartners = await generateInternalPartners();
      setProgress(30);
      
      // Generate all sample data
      const data = await generateSampleData(internalPartners, quantities);
      setProgress(50);
      
      console.log('Generated data:', data);
      
      // Add data to database in sequence
      for (const project of data.projects) {
        await db.addProject(project);
      }
      setProgress(60);
      
      for (const spi of data.spis) {
        await db.addSPI(spi);
      }
      setProgress(70);
      
      for (const objective of data.objectives) {
        await db.addObjective(objective);
      }
      setProgress(80);
      
      for (const sitrep of data.sitreps) {
        await db.addSitRep(sitrep);
      }
      setProgress(90);
      
      // Force immediate data refresh
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries({ queryKey: ['data-counts'] });
      setProgress(100);
      
      console.log('Sample data population completed successfully');
      toast({
        title: "Success",
        description: `Generated ${data.projects.length} projects, ${data.spis.length} SPIs, ${data.objectives.length} objectives, and ${data.sitreps.length} sitreps`,
      });
    } catch (error) {
      console.error('Error in populateSampleData:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to populate sample data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsPopulating(false);
      setProgress(0);
    }
  };

  return { isPopulating, populateSampleData, progress };
}