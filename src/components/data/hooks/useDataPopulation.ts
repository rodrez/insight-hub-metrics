import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/sampleData/SampleDataService";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);

  const populateSampleData = async () => {
    setIsPopulating(true);
    
    try {
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            console.log('Starting sample data population...');
            
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
            
            // Add Fortune 30 collaborators
            for (const collaborator of fortune30Partners) {
              await db.addCollaborator(collaborator);
            }
            
            // Add internal partners
            for (const partner of internalPartners) {
              await db.addCollaborator(partner);
            }

            // Add SME partners
            for (const partner of smePartners) {
              await db.addSMEPartner(partner);
            }

            // Add projects
            for (const project of projects) {
              await db.addProject(project);
            }
            
            // Add SPIs
            for (const spi of spis) {
              await db.addSPI(spi);
            }

            // Add objectives
            for (const objective of objectives) {
              await db.addObjective(objective);
            }

            // Add sitreps
            for (const sitrep of sitreps) {
              await db.addSitRep(sitrep);
            }
            
            toast({
              title: "Success",
              description: `Sample data populated successfully`,
            });

            return true;
          } catch (error) {
            console.error('Sample data population error:', error);
            toast({
              title: "Error",
              description: `Failed to populate sample data: ${error?.message || 'Unknown error'}`,
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