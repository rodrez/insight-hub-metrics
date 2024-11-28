import { SampleDataQuantities } from '../DataService';
import { BaseDBService } from './base/BaseDBService';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { generateSMEPartners } from '@/lib/services/data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { toast } from "@/components/ui/use-toast";

export class SampleDataPopulationService extends BaseDBService {
  async populateData(quantities: SampleDataQuantities): Promise<void> {
    try {
      console.log('Starting sample data population...');
      
      // Generate all sample data
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      const internalPartners = await generateInternalPartners();
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      
      // Generate projects and related data with specified quantities
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);
      
      console.log('Generated all sample data, starting database population...');

      // Add Fortune 30 partners
      for (const partner of fortune30Partners) {
        await this.performTransaction(
          'collaborators',
          'readwrite',
          store => store.put(partner)
        );
      }
      
      // Add internal partners
      for (const partner of internalPartners.slice(0, quantities.internalPartners)) {
        await this.performTransaction(
          'collaborators',
          'readwrite',
          store => store.put(partner)
        );
      }
      
      // Add SME partners
      for (const partner of smePartners) {
        await this.performTransaction(
          'smePartners',
          'readwrite',
          store => store.put(partner)
        );
      }

      // Add projects
      for (const project of projects.slice(0, quantities.projects)) {
        await this.performTransaction(
          'projects',
          'readwrite',
          store => store.put(project)
        );
      }
      
      // Add SPIs
      for (const spi of spis.slice(0, quantities.spis)) {
        await this.performTransaction(
          'spis',
          'readwrite',
          store => store.put(spi)
        );
      }

      // Add objectives
      for (const objective of objectives.slice(0, quantities.objectives)) {
        await this.performTransaction(
          'objectives',
          'readwrite',
          store => store.put(objective)
        );
      }
      
      // Add sitreps
      for (const sitrep of sitreps.slice(0, quantities.sitreps)) {
        await this.performTransaction(
          'sitreps',
          'readwrite',
          store => store.put(sitrep)
        );
      }

      console.log('Sample data population completed successfully');
      
      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      console.error('Error populating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive",
      });
      throw error;
    }
  }
}