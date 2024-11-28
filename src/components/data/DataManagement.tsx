import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DatabaseActions } from "./DatabaseActions";
import { sampleFortune30, getSampleInternalPartners } from "./SampleData";
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
          
          // Check if we have any data
          const projects = await db.getAllProjects();
          if (projects.length === 0) {
            console.log('No data found, populating sample data...');
            await populateSampleData();
          }
          
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
    setIsClearing(false);
  };

  const populateSampleData = async () => {
    if (!isInitialized && !isPopulating) {
      toast({
        title: "Error",
        description: "Please wait for database initialization to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsPopulating(true);
    
    const populateStep: LoadingStep = {
      name: "Sample Data Population",
      action: async () => {
        try {
          console.log('Starting sample data population...');
          
          // First, add all collaborators
          console.log('Adding collaborators...');
          for (const collaborator of sampleFortune30) {
            await db.addCollaborator(collaborator);
          }
          
          const internalPartners = await getSampleInternalPartners();
          for (const collaborator of internalPartners) {
            await db.addCollaborator(collaborator);
          }

          // Generate projects with the collaborators
          console.log('Generating projects...');
          const { projects } = await db.populateSampleData();
          console.log(`Generated ${projects.length} projects successfully`);

          toast({
            title: "Success",
            description: `Sample data populated with ${projects.length} projects`,
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
        } finally {
          setIsPopulating(false);
        }
      }
    };

    await executeWithRetry(populateStep);
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