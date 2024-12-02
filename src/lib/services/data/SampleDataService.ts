import { DataQuantities } from '@/lib/types/data';
import { errorHandler } from '../error/ErrorHandlingService';
import { toast } from "@/components/ui/use-toast";
import { db } from '@/lib/db';
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from './generators/projectGenerator';
import { DEPARTMENTS } from '@/lib/constants';
import { ProjectGenerationInput } from './generators/projectGenerator';

export class SampleDataService {
  async generateSampleData(quantities: DataQuantities) {
    try {
      await db.init();
      
      // Generate partners with correct slicing based on quantities
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      const internalPartners = (await generateInternalPartners()).slice(0, quantities.internalPartners);
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);

      // Create project input with correct types
      const projectInput: ProjectGenerationInput = {
        projects: quantities.projects,
        spis: quantities.spis,
        objectives: quantities.objectives,
        sitreps: quantities.sitreps,
        fortune30: quantities.fortune30,
        internalPartners: quantities.internalPartners,
        smePartners: quantities.smePartners,
        departments: Array.from(DEPARTMENTS),
        fortune30Partners: fortune30Partners,
        collaborators: internalPartners
      };

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(projectInput);

      toast({
        title: "Success",
        description: "Sample data generated successfully",
      });

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
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}