import { DataQuantities } from '@/lib/types/data';
import { SampleDataCoordinator } from './data/SampleDataCoordinator';
import { errorHandler } from './error/ErrorHandlingService';
import { toast } from "@/components/ui/use-toast";
import { db } from '@/lib/db';
import { generateFortune30Partners } from './data/generators/fortune30Generator';
import { generateInternalPartners } from './data/generators/internalPartnersGenerator';
import { generateSMEPartners } from './data/generators/smePartnersGenerator';
import { generateSampleProjects } from './data/generators/projectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './data/generators/spiGenerator';

export class SampleDataService {
  async generateSampleData(quantities: Partial<DataQuantities> = {}) {
    try {
      const validatedQuantities = {
        projects: quantities.projects ?? 10,
        spis: quantities.spis ?? 10,
        objectives: quantities.objectives ?? 5,
        sitreps: quantities.sitreps ?? 10,
        fortune30: quantities.fortune30 ?? 6,
        internalPartners: quantities.internalPartners ?? 20,
        smePartners: quantities.smePartners ?? 10
      };

      // Initialize database
      await db.init();
      
      // Generate data
      const fortune30Partners = generateFortune30Partners().slice(0, validatedQuantities.fortune30);
      const internalPartners = (await generateInternalPartners()).slice(0, validatedQuantities.internalPartners);
      const smePartners = generateSMEPartners().slice(0, validatedQuantities.smePartners);

      const { projects } = await generateSampleProjects({
        ...validatedQuantities,
        fortune30Partners,
        internalPartners
      });

      const spis = generateSampleSPIs(projects.map(p => p.id), validatedQuantities.spis);
      const objectives = generateSampleObjectives(validatedQuantities.objectives);
      const sitreps = generateSampleSitReps(spis, validatedQuantities.sitreps);

      // Save data in sequence
      await Promise.all([
        ...fortune30Partners.map(p => db.addCollaborator(p)),
        ...internalPartners.map(p => db.addCollaborator(p)),
        ...smePartners.map(p => db.addSMEPartner(p))
      ]);

      await Promise.all(projects.map(p => db.addProject(p)));
      await Promise.all(spis.map(spi => db.addSPI(spi)));
      await Promise.all(objectives.map(obj => db.addObjective(obj)));
      await Promise.all(sitreps.map(sitrep => db.addSitRep(sitrep)));

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
      console.error('Error generating sample data:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Sample Data Generation Failed',
      });
      throw error;
    }
  }
}