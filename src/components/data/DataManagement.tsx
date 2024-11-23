import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { DatabaseActions } from "./DatabaseActions";
import { DEPARTMENTS } from "@/lib/constants";
import { sampleFortune30 } from "./SampleData";
import { generateSampleData } from "@/lib/services/data/sampleDataGenerator";

export default function DataManagement() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      await db.init();
      setIsInitialized(true);
      toast({
        title: "Database initialized",
        description: "The database has been successfully initialized.",
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: "Database initialization failed",
        description: "There was an error initializing the database.",
        variant: "destructive",
      });
    }
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await initializeDB();
      toast({
        title: "Database cleared",
        description: "The database has been successfully cleared.",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error clearing database",
        description: "There was an error clearing the database.",
        variant: "destructive",
      });
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
      const { projects, internalPartners } = generateSampleData();
      
      // Add collaborators to the database
      for (const collaborator of [...sampleFortune30, ...internalPartners]) {
        await db.addCollaborator(collaborator);
      }

      // Add projects to the database
      for (const project of projects) {
        await db.addProject(project);
      }

      toast({
        title: "Sample data populated",
        description: "Sample projects and collaborators have been added to the database.",
      });
    } catch (error) {
      console.error('Error populating data:', error);
      toast({
        title: "Error populating data",
        description: "There was an error adding sample data.",
        variant: "destructive",
      });
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
