import { SampleDataQuantities } from '../DataService';
import { BaseDBService } from './base/BaseDBService';
import { generateFortune30Partners } from '../data/fortune30Partners';
import { generateInternalPartners } from '../data/internalPartners';
import { generateSMEPartners } from '../data/smePartners';
import { generateSampleProjects } from '../data/sampleProjectGenerator';
import { toast } from "@/components/ui/use-toast";

export class SampleDataPopulationService extends BaseDBService {
  async populateData(quantities: SampleDataQuantities): Promise<void> {
    try {
      // Generate all sample data
      const fortune30Partners = generateFortune30Partners();
      const internalPartners = await generateInternalPartners();
      const smePartners = generateSMEPartners();
      
      // Generate projects and related data with specified quantities
      const { projects, spis, objectives, sitreps } = await generateSampleProjects({
        projects: quantities.projects,
        spis: quantities.spis,
        objectives: quantities.objectives,
        sitreps: quantities.sitreps
      });
      
      // Add Fortune 30 partners
      for (const partner of fortune30Partners.slice(0, quantities.fortune30)) {
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
      for (const partner of smePartners.slice(0, quantities.smePartners)) {
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