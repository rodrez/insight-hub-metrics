import { generateFortune30Partners } from './data/generators/fortune30Generator';
import { generateInternalPartners } from './data/generators/internalPartnersGenerator';
import { generateSMEPartners } from './data/generators/smePartnersGenerator';
import { generateSampleProjects } from '@/components/data/SampleData';
import { DataQuantities } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from '@/lib/services/error/ErrorHandlingService';

export class SampleDataService {
  private validateQuantities(available: number, requested: number, type: string): number {
    if (requested > available) {
      console.log(`Adjusting ${type} quantity from ${requested} to ${available} (maximum available)`);
      toast({
        title: "Notice",
        description: `Requested ${requested} ${type}, but only ${available} are available. Adjusting quantity.`,
        variant: "default",
      });
      return available;
    }
    return requested;
  }

  async generateSampleData(): Promise<{
    fortune30Partners: any[];
    internalPartners: any[];
    smePartners: any[];
    projects: any[];
    spis: any[];
    objectives: any[];
    sitreps: any[];
  }> {
    try {
      const quantities: DataQuantities = {
        projects: 10,
        spis: 10,
        objectives: 5,
        sitreps: 10,
        fortune30: 6,
        internalPartners: 20,
        smePartners: 10
      };

      console.log('Starting sample data generation with quantities:', quantities);
      
      const allFortune30 = await Promise.resolve(generateFortune30Partners())
        .catch(error => {
          errorHandler.handleError(error, { type: 'data', title: 'Fortune 30 Generation Failed' });
          return [];
        });
      
      const allInternalPartners = await generateInternalPartners()
        .catch(error => {
          errorHandler.handleError(error, { type: 'data', title: 'Internal Partners Generation Failed' });
          return [];
        });
      
      const allSMEPartners = await Promise.resolve(generateSMEPartners())
        .catch(error => {
          errorHandler.handleError(error, { type: 'data', title: 'SME Partners Generation Failed' });
          return [];
        });

      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, quantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);
      const smePartners = allSMEPartners.slice(0, smeCount);

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities)
        .catch(error => {
          errorHandler.handleError(error, { type: 'data', title: 'Project Generation Failed' });
          return {
            projects: [],
            spis: [],
            objectives: [],
            sitreps: []
          };
        });

      return {
        fortune30Partners,
        internalPartners,
        smePartners,
        projects: projects.slice(0, quantities.projects),
        spis: spis.slice(0, quantities.spis),
        objectives: objectives.slice(0, quantities.objectives),
        sitreps: sitreps.slice(0, quantities.sitreps)
      };
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'data',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}