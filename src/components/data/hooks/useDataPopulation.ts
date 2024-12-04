import { useState } from "react";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { DataQuantities } from "../SampleData";
import { toast } from "@/components/ui/use-toast";
import { generateSampleData } from "@/lib/services/data/sampleDataGenerator";
import { generateInternalPartners } from "@/lib/services/data/generators/internalPartnersGenerator";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const populateSampleData = async (quantities: DataQuantities) => {
    setIsPopulating(true);
    setProgress(0);
    
    try {
      console.log('Starting data population with quantities:', quantities);
      
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
      
      // Use Promise.all for parallel database operations
      const operations = [];
      
      // Add projects in parallel
      operations.push(Promise.all(data.projects.map(project => {
        console.log('Adding project:', project.id);
        return db.addProject(project);
      })));
      setProgress(60);
      
      // Add SPIs in parallel
      operations.push(Promise.all(data.spis.map(spi => {
        console.log('Adding SPI:', spi.id);
        return db.addSPI(spi);
      })));
      setProgress(70);
      
      // Add objectives in parallel
      operations.push(Promise.all(data.objectives.map(objective => {
        console.log('Adding objective:', objective.id);
        return db.addObjective(objective);
      })));
      setProgress(80);
      
      // Add sitreps in parallel
      operations.push(Promise.all(data.sitreps.map(sitrep => {
        console.log('Adding sitrep:', sitrep.id);
        return db.addSitRep(sitrep);
      })));
      setProgress(90);
      
      // Wait for all database operations to complete
      await Promise.all(operations);
      console.log('All database operations completed');
      
      // Force immediate data refresh AFTER all operations are complete
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