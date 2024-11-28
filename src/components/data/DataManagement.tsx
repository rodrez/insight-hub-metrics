import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DatabaseActions } from "./DatabaseActions";
import { sampleFortune30, getSampleInternalPartners, generateSampleProjects } from "./SampleData";
import { executeWithRetry, LoadingStep } from "@/lib/utils/loadingRetry";

export default function DataManagement() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    const initStep: LoadingStep = {
      name: "Database Initialization",
      action: async () => {
        try {
          console.log('Starting database initialization...');
          await db.init();
          console.log('Database initialization completed');
          setIsInitialized(true);
          return true;
        } catch (error) {
          console.error('Database initialization error:', error);
          return false;
        }
      }
    };

    await executeWithRetry(initStep);
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    
    try {
      const clearStep: LoadingStep = {
        name: "Database Clear",
        action: async () => {
          try {
            console.log('Starting database clear...');
            await db.clear();
            console.log('Database cleared successfully');
            await initializeDB();
            return true;
          } catch (error) {
            console.error('Database clear error:', error);
            return false;
          }
        }
      };

      await executeWithRetry(clearStep);
    } finally {
      setIsClearing(false);
    }
  };

  const populateSampleData = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Please wait for database initialization to complete.",
        variant: "destructive",
      });
      return;
    }

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
            const internalPartners = await getSampleInternalPartners();
            for (const collaborator of internalPartners) {
              await db.addCollaborator(collaborator);
            }

            // Generate and add all sample data
            console.log('Generating and adding sample data...');
            const { projects, spis, objectives, sitreps } = await generateSampleProjects();
            
            // Add projects
            for (const project of projects) {
              await db.addProject(project);
            }
            
            // Add SPIs
            console.log('Adding SPIs...');
            for (const spi of spis) {
              await db.addSPI(spi);
            }

            // Add objectives
            console.log('Adding objectives...');
            for (const objective of objectives) {
              await db.addObjective(objective);
            }

            // Add sitreps
            console.log('Adding sitreps...');
            for (const sitrep of sitreps) {
              await db.addSitRep(sitrep);
            }
            
            console.log(`Generated ${projects.length} projects successfully`);

            toast({
              title: "Success",
              description: `Sample data populated with ${projects.length} projects, ${spis.length} SPIs, ${objectives.length} objectives, and ${sitreps.length} sitreps`,
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

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <DatabaseActions
        isInitialized={isInitialized}
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={clearDatabase}
        onPopulate={populateSampleData}
      />
    </div>
  );
}