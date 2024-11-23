import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DatabaseActions } from "./DatabaseActions";
import { sampleFortune30, sampleInternalPartners } from "./SampleData";
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
          await db.init();
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
          await db.clear();
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
    if (!isInitialized) {
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
          for (const collaborator of [...sampleFortune30, ...sampleInternalPartners]) {
            await db.addCollaborator(collaborator);
          }

          // Generate projects with the collaborators
          console.log('Generating projects...');
          const { projects } = await db.populateSampleData();
          console.log(`Generated ${projects.length} projects`);

          return true;
        } catch (error) {
          console.error('Sample data population error:', error);
          return false;
        }
      }
    };

    await executeWithRetry(populateStep);
    setIsPopulating(false);
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