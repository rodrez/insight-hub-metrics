import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/sampleData/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";

export function useDataPopulation() {
  const [isPopulating, setIsPopulating] = useState(false);
  const queryClient = useQueryClient();

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
            
            // Sequential database operations with proper error handling
            await Promise.all([
              ...fortune30Partners.map(collaborator => 
                db.addCollaborator(collaborator).catch(e => {
                  console.error('Error adding fortune30 partner:', e);
                  throw e;
                })
              ),
              
              ...internalPartners.map(partner => 
                db.addCollaborator(partner).catch(e => {
                  console.error('Error adding internal partner:', e);
                  throw e;
                })
              ),

              ...smePartners.map(partner => 
                db.addSMEPartner(partner).catch(e => {
                  console.error('Error adding SME partner:', e);
                  throw e;
                })
              )
            ]);

            // Add projects sequentially to maintain data integrity
            for (const project of projects) {
              await db.addProject(project).catch(e => {
                console.error('Error adding project:', e);
                throw e;
              });
            }
            
            await Promise.all([
              ...spis.map(spi => 
                db.addSPI(spi).catch(e => {
                  console.error('Error adding SPI:', e);
                  throw e;
                })
              ),

              ...objectives.map(objective => 
                db.addObjective(objective).catch(e => {
                  console.error('Error adding objective:', e);
                  throw e;
                })
              ),

              ...sitreps.map(sitrep => 
                db.addSitRep(sitrep).catch(e => {
                  console.error('Error adding sitrep:', e);
                  throw e;
                })
              )
            ]);
            
            // Invalidate queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['data-counts'] });
            
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