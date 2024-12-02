import { useState } from "react";
import { db } from "@/lib/db";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { SampleDataService } from "@/lib/services/data/SampleDataService";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseError } from "@/lib/utils/errorHandling";
import { DatabaseOperations } from "../operations/DatabaseOperations";
import { DataQuantities } from "../types/dataTypes";
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
      console.log('Starting data population with quantities:', quantities);
      
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            // First ensure database is initialized
            console.log('Initializing database...');
            await db.init();
            console.log('Database initialized successfully');

            // Clear existing data
            console.log('Clearing existing data...');
            await db.clear();
            console.log('Existing data cleared successfully');

            // Generate and save new data
            console.log('Generating sample data...');
            await sampleDataService.generateSampleData({
              ...quantities,
              initiatives: quantities.initiatives || 5 // Provide default value if missing
            });
            console.log('Sample data generated and saved successfully');

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['data-counts'] });
            
            return true;
          } catch (error) {
            console.error('Detailed error in populateStep:', {
              error,
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined
            });
            return false;
          }
        }
      };

      await executeWithRetry(populateStep);
      
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      console.error('Data population failed:', error);
      toast({
        title: "Error",
        description: "Failed to populate data. Check console for details.",
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