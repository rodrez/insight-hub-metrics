import { toast } from "@/components/ui/use-toast";
import { DataQuantities } from '@/lib/types/data';
import { db } from "@/lib/db";
import { SequentialDataGenerator } from "./generators/SequentialDataGenerator";
import { errorHandler } from '../error/ErrorHandlingService';

export class DataGenerationService {
  async generateAndSaveData(quantities: DataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }): Promise<{ success: boolean; error?: any }> {
    try {
      console.log('Starting sequential data generation with quantities:', quantities);
      
      // Verify database connection
      if (!db.getDatabase()) {
        console.log('Database not initialized, initializing...');
        await db.init();
      }
      
      // Generate data with transaction support
      await SequentialDataGenerator.generateData(quantities);
      
      toast({
        title: "Success",
        description: "All data generated and saved successfully",
      });

      console.log('Data generation completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in generateAndSaveData:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      
      return { success: false, error };
    }
  }
}