import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';
import { DataQuantities } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './generators/spiGenerator';
import { ProgressTracker } from '@/lib/utils/progressTracking';

export class SampleDataService {
  private progressTracker: ProgressTracker;

  constructor() {
    this.progressTracker = new ProgressTracker();
  }

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

  async generateSampleData(quantities: DataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }) {
    try {
      this.progressTracker.addStep('Fortune 30 Partners', quantities.fortune30);
      this.progressTracker.addStep('Internal Partners', quantities.internalPartners);
      this.progressTracker.addStep('SME Partners', quantities.smePartners);
      this.progressTracker.addStep('Projects', quantities.projects);
      
      const allFortune30 = generateFortune30Partners();
      const allInternalPartners = await generateInternalPartners();
      const allSMEPartners = generateSMEPartners();

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, quantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);
      const smePartners = allSMEPartners.slice(0, smeCount);

      this.progressTracker.updateProgress('Fortune 30 Partners', fortune30Partners.length);
      this.progressTracker.updateProgress('Internal Partners', internalPartners.length);
      this.progressTracker.updateProgress('SME Partners', smePartners.length);

      // Generate SPIs, objectives, and sitreps
      const spis = generateSampleSPIs([], quantities.spis);
      const objectives = generateSampleObjectives(quantities.objectives);
      const sitreps = generateSampleSitReps(spis, quantities.sitreps);

      this.progressTracker.updateProgress('Projects', quantities.projects);

      return {
        fortune30Partners,
        internalPartners,
        smePartners,
        projects: [],  // Projects will be generated based on the partners
        spis,
        objectives,
        sitreps
      };
    } catch (error) {
      console.error('Error in sample data generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      this.progressTracker.reset();
    }
  }

  getProgress(): number {
    return this.progressTracker.getTotalProgress();
  }
}