import { Project, Collaborator, Department } from '@/lib/types';
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
      
      // Generate all partners first
      const fortune30Partners = generateFortune30Partners();
      const internalPartners = await generateInternalPartners();
      const allSMEPartners = generateSMEPartners();
      
      // Ensure we only take the requested number of SME partners
      const smePartners = allSMEPartners.slice(0, quantities.smePartners);

      // Convert readonly DEPARTMENTS to regular array for project generation
      const departments: Department[] = [...DEPARTMENTS];

      // Generate projects using the partners
      const { projects, spis, objectives, sitreps } = await generateSampleProjects({
        ...quantities,
        departments,
        fortune30Partners,
        internalPartners,
        smePartners
      });

      this.progressTracker.updateProgress('Fortune 30 Partners', fortune30Partners.length);
      this.progressTracker.updateProgress('Internal Partners', internalPartners.length);
      this.progressTracker.updateProgress('SME Partners', smePartners.length);
      this.progressTracker.updateProgress('Projects', projects.length);

      // Log the counts for debugging
      console.log('Generated data counts:', {
        fortune30: fortune30Partners.length,
        internal: internalPartners.length,
        sme: smePartners.length,
        projects: projects.length
      });

      return {
        fortune30Partners: fortune30Partners.slice(0, quantities.fortune30),
        internalPartners: internalPartners.slice(0, quantities.internalPartners),
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