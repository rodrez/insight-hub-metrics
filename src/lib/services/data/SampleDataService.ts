import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from './generators/projectGenerator';
import { DataQuantities, dataQuantitiesSchema } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator, validateProject } from './utils/dataGenerationUtils';
import { DEPARTMENTS } from '@/lib/constants';

export class SampleDataService {
  async generateSampleData(quantities: Partial<DataQuantities> = {}) {
    try {
      const validatedQuantities = dataQuantitiesSchema.parse(quantities);
      
      // Generate partners synchronously since they don't need to be async
      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator);
      const internalPartners = (await generateInternalPartners()).filter(validateCollaborator);
      const smePartners = generateSMEPartners().filter(validateCollaborator);

      // Generate project data with validated partners
      const projectInput = {
        ...validatedQuantities,
        departments: [...DEPARTMENTS],
        fortune30Partners: fortune30Partners.slice(0, validatedQuantities.fortune30),
        internalPartners: internalPartners.slice(0, validatedQuantities.internalPartners),
        smePartners: smePartners.slice(0, validatedQuantities.smePartners)
      };

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(projectInput);

      return {
        fortune30Partners: fortune30Partners.slice(0, validatedQuantities.fortune30),
        internalPartners: internalPartners.slice(0, validatedQuantities.internalPartners),
        smePartners: smePartners.slice(0, validatedQuantities.smePartners),
        projects: projects.slice(0, validatedQuantities.projects),
        spis: spis.slice(0, validatedQuantities.spis),
        objectives: objectives.slice(0, validatedQuantities.objectives),
        sitreps: sitreps.slice(0, validatedQuantities.sitreps)
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