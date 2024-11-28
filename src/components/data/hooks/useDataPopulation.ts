import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { sampleFortune30 } from "@/lib/services/data/fortune30Partners";
import { generateInternalPartners } from "@/lib/services/data/internalPartners";

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
            
            // Add Fortune 30 collaborators
            console.log('Adding Fortune 30 collaborators...');
            for (const collaborator of sampleFortune30) {
              await db.addCollaborator(collaborator);
            }
            
            // Add internal partners
            console.log('Adding internal partners...');
            const internalPartners = await generateInternalPartners();
            for (const collaborator of internalPartners) {
              await db.addCollaborator(collaborator);
            }

            // Generate and add all sample data
            console.log('Generating and adding sample data...');
            const result = await generateSampleProjects(sampleFortune30, internalPartners);
            
            // Add projects
            for (const project of result.projects) {
              await db.addProject(project);
            }
            
            // Add SPIs
            console.log('Adding SPIs...');
            for (const spi of result.spis) {
              await db.addSPI(spi);
            }

            // Add objectives
            console.log('Adding objectives...');
            for (const objective of result.objectives) {
              await db.addObjective(objective);
            }

            // Add sitreps
            console.log('Adding sitreps...');
            for (const sitrep of result.sitreps) {
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