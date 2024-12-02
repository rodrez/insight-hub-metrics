import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/data/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";
import { DataQuantities } from "../SampleData";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const databaseOps = new DatabaseOperations();
  const sampleDataService = new SampleDataService();

  const populateSampleData = async (quantities: DataQuantities) => {
    setIsPopulating(true);
    setProgress(0);
    
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
            } = await sampleDataService.generateSampleData(quantities);

            // Add data to database in sequence with progress updates
            const totalSteps = 7;
            let currentStep = 0;

            await databaseOps.addCollaboratorsInBatches(fortune30Partners, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            await databaseOps.addCollaboratorsInBatches(internalPartners, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            // Explicitly add SME partners to their dedicated store
            await databaseOps.addSMEPartnersInBatches(smePartners, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            await databaseOps.addProjectsInBatches(projects, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            await databaseOps.addSPIsInBatches(spis, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            await databaseOps.addObjectivesInBatches(objectives, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

            await databaseOps.addSitRepsInBatches(sitreps, () => {
              currentStep++;
              setProgress((currentStep / totalSteps) * 100);
            });

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
      setProgress(0);
    }
  };

  return { isPopulating, populateSampleData, progress };
}