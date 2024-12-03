import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/data/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";
import { DataQuantities } from "../SampleData";
import { toast } from "@/components/ui/use-toast";

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
      console.log('Starting sample data population with quantities:', quantities);
      
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            await db.init();
            console.log('Database initialized, generating sample data...');
            
            const data = await sampleDataService.generateSampleData(quantities);
            console.log('Sample data generated:', data);

            // Add data to database in sequence with progress updates
            const totalSteps = 7;
            let currentStep = 0;

            // Add Fortune 30 partners
            await db.clear(); // Clear existing data first
            console.log('Adding Fortune 30 partners...');
            for (const partner of data.fortune30Partners) {
              await db.addCollaborator(partner);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add internal partners
            console.log('Adding internal partners...');
            for (const partner of data.internalPartners) {
              await db.addCollaborator(partner);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add SME partners
            console.log('Adding SME partners...');
            for (const partner of data.smePartners) {
              await db.addSMEPartner(partner);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add projects
            console.log('Adding projects...', data.projects);
            for (const project of data.projects) {
              await db.addProject(project);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add SPIs
            console.log('Adding SPIs...');
            for (const spi of data.spis) {
              await db.addSPI(spi);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add objectives
            console.log('Adding objectives...');
            for (const objective of data.objectives) {
              await db.addObjective(objective);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Add sitreps
            console.log('Adding sitreps...');
            for (const sitrep of data.sitreps) {
              await db.addSitRep(sitrep);
            }
            currentStep++;
            setProgress((currentStep / totalSteps) * 100);

            // Invalidate queries to refresh data
            await queryClient.invalidateQueries();
            
            console.log('Sample data population completed successfully');
            return true;
          } catch (error) {
            console.error('Sample data population error:', error);
            return false;
          }
        }
      };

      await executeWithRetry(populateStep);
      
      // Force a refresh of the counts
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      console.error('Error in populateSampleData:', error);
      toast({
        title: "Error",
        description: "Failed to populate sample data",
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