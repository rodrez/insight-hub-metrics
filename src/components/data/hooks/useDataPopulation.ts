import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/sampleData/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const queryClient = useQueryClient();
  const databaseOps = new DatabaseOperations();

  const populateSampleData = async () => {
    setIsPopulating(true);
    
    try {
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            const sampleDataService = new SampleDataService();
            const {
              fortune30Partners,
              internalPartners,
              smePartners,
              projects,
              spis,
              objectives,
              sitreps
            } = await sampleDataService.generateSampleData();

            // Add partners with progress tracking
            await databaseOps.addCollaboratorsInBatches(
              fortune30Partners,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'fortune30'], { progress });
              }
            );

            await databaseOps.addCollaboratorsInBatches(
              internalPartners,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'internal'], { progress });
              }
            );

            await databaseOps.addCollaboratorsInBatches(
              smePartners,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'sme'], { progress });
              }
            );

            // Add projects and related data with progress tracking
            await databaseOps.addProjectsInBatches(
              projects,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'projects'], { progress });
              }
            );

            await databaseOps.addSPIsInBatches(
              spis,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'spis'], { progress });
              }
            );

            await databaseOps.addObjectivesInBatches(
              objectives,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'objectives'], { progress });
              }
            );

            await databaseOps.addSitRepsInBatches(
              sitreps,
              (progress) => {
                queryClient.setQueryData(['data-generation', 'sitreps'], { progress });
              }
            );

            // Invalidate queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['data-counts'] });
            
            toast({
              title: "Success",
              description: "Sample data populated successfully",
            });

            return true;
          } catch (error) {
            const errorMessage = error instanceof DatabaseError 
              ? error.message 
              : error instanceof Error 
                ? error.message 
                : 'Unknown error';
                
            console.error('Sample data population error:', error);
            toast({
              title: "Error",
              description: `Failed to populate sample data: ${errorMessage}`,
              variant: "destructive",
            });
            return false;
          }
        }
      };

      await executeWithRetry(populateStep);
    } finally {
      setIsPopulating(false);
    }
  };

  return { isPopulating, populateSampleData };
}