import { DataQuantities } from '@/components/data/SampleData';
import { generateSampleProjects } from '@/components/data/SampleData';
import { db } from '@/lib/db';
import { toast } from "@/components/ui/use-toast";

export class SampleDataService {
  async generateSampleData(quantities: DataQuantities) {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      // Initialize database first
      await db.init();
      console.log('Database initialized successfully');

      // Generate sample data
      const generatedData = await generateSampleProjects(quantities);
      console.log('Sample data generated:', generatedData);

      // Add projects to database
      console.log('Adding projects to database...');
      for (const project of generatedData.projects) {
        try {
          await db.addProject(project);
        } catch (error) {
          console.error('Error adding project:', project.id, error);
          throw error;
        }
      }

      // Add SPIs to database
      console.log('Adding SPIs to database...');
      for (const spi of generatedData.spis) {
        try {
          await db.addSPI(spi);
        } catch (error) {
          console.error('Error adding SPI:', spi.id, error);
          throw error;
        }
      }

      // Add objectives to database
      console.log('Adding objectives to database...');
      for (const objective of generatedData.objectives) {
        try {
          await db.addObjective(objective);
        } catch (error) {
          console.error('Error adding objective:', objective.id, error);
          throw error;
        }
      }

      // Add sitreps to database
      console.log('Adding sitreps to database...');
      for (const sitrep of generatedData.sitreps) {
        try {
          await db.addSitRep(sitrep);
        } catch (error) {
          console.error('Error adding sitrep:', sitrep.id, error);
          throw error;
        }
      }

      console.log('Sample data population completed successfully');
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });

      return generatedData;
    } catch (error) {
      console.error('Detailed error in sample data generation:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast({
        title: "Error",
        description: "Failed to populate sample data. Check console for details.",
        variant: "destructive",
      });
      
      throw error;
    }
  }
}