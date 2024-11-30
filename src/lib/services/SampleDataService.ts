import { generateFortune30Partners } from './data/generators/fortune30Generator';
import { generateInternalPartners } from './data/generators/internalPartnersGenerator';
import { generateSMEPartners } from './data/generators/smePartnersGenerator';
import { generateSampleProjects } from '@/components/data/SampleData';
import { DataQuantities, dataQuantitiesSchema } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";
import { errorHandler } from '@/lib/services/error/ErrorHandlingService';
import { validateCollaborator, validateProject } from './data/utils/dataGenerationUtils';

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
      
      // Parse and validate quantities with defaults
      const validatedQuantities = dataQuantitiesSchema.parse(quantities);
      
      const fortune30Partners = await Promise.resolve(generateFortune30Partners())
        .then(partners => partners.filter(validateCollaborator));
      
      const internalPartners = await generateInternalPartners()
        .then(partners => partners.filter(validateCollaborator));
      
      const allSMEPartners = await Promise.resolve(generateSMEPartners())
        .then(partners => partners.filter(validateCollaborator));

      const fortune30Count = this.validateQuantities(
        fortune30Partners.length, 
        validatedQuantities.fortune30, 
        "Fortune 30 partners"
      );
      
      const internalCount = this.validateQuantities(
        internalPartners.length, 
        validatedQuantities.internalPartners, 
        "internal partners"
      );
      
      const smeCount = this.validateQuantities(
        allSMEPartners.length, 
        validatedQuantities.smePartners, 
        "SME partners"
      );

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(validatedQuantities);

      const validatedProjects = projects.filter(validateProject);

      return {
        fortune30Partners: fortune30Partners.slice(0, fortune30Count),
        internalPartners: internalPartners.slice(0, internalCount),
        smePartners: allSMEPartners.slice(0, smeCount),
        projects: validatedProjects.slice(0, validatedQuantities.projects),
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