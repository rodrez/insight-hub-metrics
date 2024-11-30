import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from './data/fortune30Partners';
import { generateInternalPartners } from './data/internalPartners';
import { generateSMEPartners } from './data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './sampleData/spiData';
import { DataQuantities } from '@/lib/types/data';
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

  async generateSampleData(quantities: Partial<DataQuantities> = {}): Promise<{
    fortune30Partners: Collaborator[];
    internalPartners: Collaborator[];
    smePartners: Collaborator[];
    projects: Project[];
    spis: any[];
    objectives: any[];
    sitreps: any[];
  }> {
    try {
      // Ensure all required properties have default values
      const defaultQuantities: DataQuantities = {
        projects: 10,
        spis: 10,
        objectives: 5,
        sitreps: 10,
        fortune30: 6,
        internalPartners: 20,
        smePartners: 10
      };

      // Merge provided quantities with defaults
      const finalQuantities: DataQuantities = {
        ...defaultQuantities,
        ...quantities
      };

      console.log('Starting sample data generation with quantities:', finalQuantities);
      
      const allFortune30 = generateFortune30Partners();
      console.log('Generated Fortune 30 partners:', allFortune30.length);
      
      const allInternalPartners = await generateInternalPartners();
      console.log('Generated internal partners:', allInternalPartners.length);
      
      const allSMEPartners = generateSMEPartners();
      console.log('Generated SME partners:', allSMEPartners.length);

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, finalQuantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, finalQuantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, finalQuantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(finalQuantities);

      return {
        fortune30Partners,
        internalPartners,
        smePartners: allSMEPartners.slice(0, smeCount),
        projects: projects.slice(0, finalQuantities.projects),
        spis: spis.slice(0, finalQuantities.spis),
        objectives: objectives.slice(0, finalQuantities.objectives),
        sitreps: sitreps.slice(0, finalQuantities.sitreps)
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