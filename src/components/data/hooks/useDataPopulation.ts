import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/sampleData/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";

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
            
            // Add fortune30 partners
            await Promise.all(fortune30Partners.map(async collaborator => {
              try {
                await db.addCollaborator(collaborator);
              } catch (error) {
                throw new DatabaseError(`Failed to add fortune30 partner: ${collaborator.name}`, error);
              }
            }));
            
            // Add internal partners
            await Promise.all(internalPartners.map(async partner => {
              try {
                await db.addCollaborator(partner);
              } catch (error) {
                throw new DatabaseError(`Failed to add internal partner: ${partner.name}`, error);
              }
            }));

            // Add SME partners
            await Promise.all(smePartners.map(async partner => {
              try {
                await db.addSMEPartner(partner);
              } catch (error) {
                throw new DatabaseError(`Failed to add SME partner: ${partner.name}`, error);
              }
            }));

            // Add projects sequentially to maintain data integrity
            for (const project of projects) {
              try {
                await db.addProject(project);
              } catch (error) {
                throw new DatabaseError(`Failed to add project: ${project.name}`, error);
              }
            }
            
            // Add SPIs, objectives, and sitreps
            await Promise.all([
              ...spis.map(async spi => {
                try {
                  await db.addSPI(spi);
                } catch (error) {
                  throw new DatabaseError(`Failed to add SPI: ${spi.id}`, error);
                }
              }),

              ...objectives.map(async objective => {
                try {
                  await db.addObjective(objective);
                } catch (error) {
                  throw new DatabaseError(`Failed to add objective: ${objective.id}`, error);
                }
              }),

              ...sitreps.map(async sitrep => {
                try {
                  await db.addSitRep(sitrep);
                } catch (error) {
                  throw new DatabaseError(`Failed to add sitrep: ${sitrep.id}`, error);
                }
              })
            ]);
            
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