import { Project, Collaborator } from '../types';
import { generateFortune30Partners } from './data/fortune30Partners';
import { generateInternalPartners } from './data/internalPartners';
import { generateSMEPartners } from './data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './sampleData/spiData';
import { SampleDataQuantities } from './DataService';
import { toast } from "@/components/ui/use-toast";

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

  async generateSampleData(quantities: SampleDataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }) {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      const allFortune30 = generateFortune30Partners();
      console.log('Generated Fortune 30 partners:', allFortune30.length);
      
      const allInternalPartners = await generateInternalPartners();
      console.log('Generated internal partners:', allInternalPartners.length);
      
      const allSMEPartners = generateSMEPartners();
      console.log('Generated SME partners:', allSMEPartners.length);

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, quantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);

      const { projects, spis, objectives, sitreps } = await generateSampleProjects({
        projects: quantities.projects,
        spis: quantities.spis,
        objectives: quantities.objectives,
        sitreps: quantities.sitreps,
        fortune30: quantities.fortune30,
        internalPartners: quantities.internalPartners
      });

      return {
        fortune30Partners,
        internalPartners,
        smePartners: allSMEPartners.slice(0, smeCount),
        projects: projects.slice(0, quantities.projects),
        spis: spis.slice(0, quantities.spis),
        objectives: objectives.slice(0, quantities.objectives),
        sitreps: sitreps.slice(0, quantities.sitreps)
      };
    } catch (error) {
      console.error('Error in sample data generation:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
}