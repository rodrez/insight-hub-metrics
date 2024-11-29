import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/data/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";
import { globalProgressTracker } from "@/lib/utils/progressTracking";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const queryClient = useQueryClient();
  const databaseOps = new DatabaseOperations();
  const sampleDataService = new SampleDataService();

  const populateSampleData = async () => {
    setIsPopulating(true);
    
    try {
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            const {
              fortune30Partners,
              internalPartners,
              smePartners,
              projects,
              spis,
              objectives,
              sitreps
            } = await sampleDataService.generateSampleData();

            // Add data to database in sequence
            await databaseOps.addCollaboratorsInBatches(fortune30Partners);
            await databaseOps.addCollaboratorsInBatches(internalPartners);
            await databaseOps.addCollaboratorsInBatches(smePartners);
            await databaseOps.addProjectsInBatches(projects);
            await databaseOps.addSPIsInBatches(spis);
            await databaseOps.addObjectivesInBatches(objectives);
            await databaseOps.addSitRepsInBatches(sitreps);

            queryClient.invalidateQueries({ queryKey: ['data-counts'] });
            
            return true;
          } catch (error) {
            console.error('Sample data population error:', error);
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