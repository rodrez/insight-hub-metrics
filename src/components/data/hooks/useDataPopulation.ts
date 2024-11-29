import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/sampleData/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const databaseOps = new DatabaseOperations();

  const updateProgress = (stepProgress: number, stepIndex: number, totalSteps: number) => {
    const overallProgress = ((stepIndex + (stepProgress / 100)) / totalSteps) * 100;
    setProgress(overallProgress);
  };

  const populateSampleData = async () => {
    setIsPopulating(true);
    setProgress(0);
    
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

            const totalSteps = 7; // Total number of data types to populate
            let currentStep = 0;

            await databaseOps.addCollaboratorsInBatches(
              fortune30Partners,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addCollaboratorsInBatches(
              internalPartners,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addCollaboratorsInBatches(
              smePartners,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addProjectsInBatches(
              projects,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addSPIsInBatches(
              spis,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addObjectivesInBatches(
              objectives,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );
            currentStep++;

            await databaseOps.addSitRepsInBatches(
              sitreps,
              (progress) => updateProgress(progress, currentStep, totalSteps)
            );

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