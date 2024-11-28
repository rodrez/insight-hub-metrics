import { SampleDataQuantities } from '../DataService';
import { BaseDBService } from './base/BaseDBService';
import { generateSampleData } from '../sampleData/sampleDataGenerator';
import { toast } from "@/components/ui/use-toast";

export class SampleDataPopulationService extends BaseDBService {
  async populateData(quantities: SampleDataQuantities): Promise<void> {
    try {
      const { projects, internalPartners, spis, objectives, sitreps } = 
        await generateSampleData([]);
      
      // Add all data in sequence
      for (const project of projects) {
        await this.performTransaction(
          'projects',
          'readwrite',
          store => store.put(project)
        );
      }
      
      for (const partner of internalPartners) {
        await this.performTransaction(
          'collaborators',
          'readwrite',
          store => store.put(partner)
        );
      }
      
      for (const spi of spis) {
        await this.performTransaction(
          'spis',
          'readwrite',
          store => store.put(spi)
        );
      }
      
      for (const objective of objectives) {
        await this.performTransaction(
          'objectives',
          'readwrite',
          store => store.put(objective)
        );
      }
      
      for (const sitrep of sitreps) {
        await this.performTransaction(
          'sitreps',
          'readwrite',
          store => store.put(sitrep)
        );
      }

      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive",
      });
      throw error;
    }
  }
}