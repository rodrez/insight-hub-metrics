import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { generateSMEPartners } from '@/lib/services/data/smePartners';
import { generateSampleProjects } from './projectBuilder';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiData';
import { SampleDataQuantities } from '../DataService';
import { toast } from "@/components/ui/use-toast";

export class SampleDataService {
  private validateQuantities(available: number, requested: number, type: string): number {
    if (requested > available) {
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
      const allFortune30 = generateFortune30Partners();
      const allInternalPartners = await generateInternalPartners();
      const allSMEPartners = generateSMEPartners();

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, quantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);

      // Generate projects using the selected partners
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(fortune30Partners, internalPartners);
      
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
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
}