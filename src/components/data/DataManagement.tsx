import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DatabaseActions } from "./DatabaseActions";
import { sampleFortune30, getSampleInternalPartners, generateSampleProjects } from "./SampleData";
import { executeWithRetry, LoadingStep } from "@/lib/utils/loadingRetry";
import { Card, CardContent } from "@/components/ui/card";

interface DataCounts {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
}

export default function DataManagement() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [dataCounts, setDataCounts] = useState<DataCounts>({
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  });

  useEffect(() => {
    initializeDB();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      updateDataCounts();
    }
  }, [isInitialized]);

  const updateDataCounts = async () => {
    try {
      const projects = await db.getAllProjects();
      const spis = await db.getAllSPIs();
      const objectives = await db.getAllObjectives();
      const sitreps = await db.getAllSitReps();
      const collaborators = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();

      setDataCounts({
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        sitreps: sitreps.length,
        fortune30: collaborators.filter(c => c.type === 'fortune30').length,
        internalPartners: collaborators.filter(c => c.type === 'other').length,
        smePartners: smePartners.length
      });
    } catch (error) {
      console.error('Error updating data counts:', error);
    }
  };

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
            await updateDataCounts();
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
            
            await updateDataCounts();
            
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
      
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Current Data Counts</h3>
          <div className="grid gap-2">
            {Object.entries(dataCounts).map(([key, count]) => (
              <div key={key} className="flex justify-between items-center">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}