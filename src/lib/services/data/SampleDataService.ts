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
      
      // Generate all partners first
      const [fortune30Partners, internalPartners, smePartners] = await Promise.all([
        Promise.resolve(generateFortune30Partners()),
        generateInternalPartners(),
        Promise.resolve(generateSMEPartners())
      ]);

      // Validate partners
      const validFortune30 = fortune30Partners.filter(validateCollaborator);
      const validInternalPartners = internalPartners.filter(validateCollaborator);
      const validSMEPartners = smePartners.filter(validateCollaborator);

      // Generate project data with validated partners
      const projectInput = {
        ...validatedQuantities,
        departments: [...DEPARTMENTS],
        fortune30Partners: validFortune30.slice(0, validatedQuantities.fortune30),
        internalPartners: validInternalPartners.slice(0, validatedQuantities.internalPartners),
        smePartners: validSMEPartners.slice(0, validatedQuantities.smePartners)
      };

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(projectInput);

      return {
        fortune30Partners: validFortune30.slice(0, validatedQuantities.fortune30),
        internalPartners: validInternalPartners.slice(0, validatedQuantities.internalPartners),
        smePartners: validSMEPartners.slice(0, validatedQuantities.smePartners),
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