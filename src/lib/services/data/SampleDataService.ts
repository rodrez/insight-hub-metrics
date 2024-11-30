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

  async generateSampleData(quantities: Partial<DataQuantities> = {}): Promise<any> {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      const validatedQuantities = dataQuantitiesSchema.parse(quantities);
      
      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator);
      const internalPartners = await generateInternalPartners();
      const validatedInternalPartners = internalPartners.filter(validateCollaborator);
      const allSMEPartners = generateSMEPartners().filter(validateCollaborator);

      const fortune30Count = this.validateQuantities(
        fortune30Partners.length, 
        validatedQuantities.fortune30, 
        "Fortune 30 partners"
      );
      
      const internalCount = this.validateQuantities(
        validatedInternalPartners.length, 
        validatedQuantities.internalPartners, 
        "internal partners"
      );
      
      const smeCount = this.validateQuantities(
        allSMEPartners.length, 
        validatedQuantities.smePartners, 
        "SME partners"
      );

      const projectInput = {
        ...validatedQuantities,
        departments: [...DEPARTMENTS],
        fortune30Partners: fortune30Partners.slice(0, fortune30Count),
        internalPartners: validatedInternalPartners.slice(0, internalCount),
        smePartners: allSMEPartners.slice(0, smeCount)
      };

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(projectInput);
      const validatedProjects = projects.filter(validateProject);

      return {
        fortune30Partners: fortune30Partners.slice(0, fortune30Count),
        internalPartners: validatedInternalPartners.slice(0, internalCount),
        smePartners: allSMEPartners.slice(0, smeCount),
        projects: validatedProjects,
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