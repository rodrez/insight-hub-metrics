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
import { generateSampleProjects } from './generators/projectGenerator';
import { ProgressTracker } from '@/lib/utils/progressTracking';
import { DEPARTMENTS } from '@/lib/constants';

export class SampleDataService {
  private progressTracker: ProgressTracker;

  constructor() {
    this.progressTracker = new ProgressTracker();
  }

  async generateSampleData(quantities: Partial<DataQuantities> = {}) {
    try {
      const validatedQuantities = dataQuantitiesSchema.parse(quantities);
      
      this.progressTracker.addStep('Fortune 30 Partners', validatedQuantities.fortune30);
      this.progressTracker.addStep('Internal Partners', validatedQuantities.internalPartners);
      this.progressTracker.addStep('SME Partners', validatedQuantities.smePartners);
      this.progressTracker.addStep('Projects', validatedQuantities.projects);
      
      // Generate partners synchronously
      const fortune30Partners = generateFortune30Partners();
      const internalPartners = await generateInternalPartners();
      const allSMEPartners = generateSMEPartners();
      
      // Take only the requested number of partners
      const smePartners = allSMEPartners.slice(0, validatedQuantities.smePartners);
      const selectedFortune30 = fortune30Partners.slice(0, validatedQuantities.fortune30);
      const selectedInternal = internalPartners.slice(0, validatedQuantities.internalPartners);

      // Convert readonly DEPARTMENTS to regular array for project generation
      const departments = [...DEPARTMENTS];

      // Generate projects using the partners
      const { projects, spis, objectives, sitreps } = await generateSampleProjects({
        ...validatedQuantities,
        departments,
        fortune30Partners: selectedFortune30,
        internalPartners: selectedInternal,
        smePartners
      });

      this.progressTracker.updateProgress('Fortune 30 Partners', selectedFortune30.length);
      this.progressTracker.updateProgress('Internal Partners', selectedInternal.length);
      this.progressTracker.updateProgress('SME Partners', smePartners.length);
      this.progressTracker.updateProgress('Projects', projects.length);

      return {
        fortune30Partners: selectedFortune30,
        internalPartners: selectedInternal,
        smePartners,
        projects,
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