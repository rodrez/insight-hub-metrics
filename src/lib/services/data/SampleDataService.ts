import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from './generators/projectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './generators/spiGenerator';
import { DataQuantities } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";
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
      console.log('Starting sample data generation with quantities:', quantities);
      
      // Initialize progress tracking
      this.progressTracker.addStep('Fortune 30 Partners', quantities.fortune30);
      this.progressTracker.addStep('Internal Partners', quantities.internalPartners);
      this.progressTracker.addStep('SME Partners', quantities.smePartners);
      this.progressTracker.addStep('Projects', quantities.projects);
      
      // Generate Fortune 30 partners with progress tracking
      const allFortune30 = generateFortune30Partners();
      this.progressTracker.updateProgress('Fortune 30 Partners', allFortune30.length);
      console.log('Generated Fortune 30 partners:', allFortune30.length);
      
      // Generate internal partners with progress tracking
      const allInternalPartners = await generateInternalPartners();
      this.progressTracker.updateProgress('Internal Partners', allInternalPartners.length);
      console.log('Generated internal partners:', allInternalPartners.length);
      
      // Generate SME partners with progress tracking
      const allSMEPartners = generateSMEPartners();
      this.progressTracker.updateProgress('SME Partners', allSMEPartners.length);
      console.log('Generated SME partners:', allSMEPartners.length);

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");
      const smeCount = this.validateQuantities(allSMEPartners.length, quantities.smePartners, "SME partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);
      const smePartners = allSMEPartners.slice(0, smeCount);

      // Generate project data with dependencies
      const { projects, spis, objectives, sitreps } = await generateSampleProjects({
        ...quantities,
        fortune30Partners,
        internalPartners,
        smePartners
      });

      this.progressTracker.updateProgress('Projects', projects.length);

      return {
        fortune30Partners,
        internalPartners,
        smePartners,
        projects,
        spis,
        objectives,
        sitreps
      };
    } catch (error) {
      console.error('Error in sample data generation:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      this.progressTracker.setStepError('Sample Data Generation');
      throw error;
    } finally {
      this.progressTracker.reset();
    }
  }
}