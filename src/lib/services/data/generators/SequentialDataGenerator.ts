import { DataQuantities } from '@/lib/types/data';
import { TransactionManager } from "../transaction/TransactionManager";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { PartnerGenerationStep } from './steps/PartnerGenerationStep';
import { ProjectGenerationStep } from './steps/ProjectGenerationStep';
import { SPIGenerationStep } from './steps/SPIGenerationStep';
import { generateSampleObjectives, generateSampleSitReps } from './spiGenerator';
import { DataIntegrityChecker } from '../validation/DataIntegrityChecker';

export class SequentialDataGenerator {
  static async generateData(quantities: DataQuantities) {
    console.log('Starting sequential data generation with quantities:', quantities);
    
    return TransactionManager.executeInTransaction(
      async () => {
        // Step 1: Generate all partners first
        console.log('Step 1: Generating partners...');
        const { fortune30Partners, internalPartners, smePartners } = 
          await PartnerGenerationStep.execute(quantities);
        
        // Step 2: Generate projects (which can now reference partners)
        console.log('Step 2: Generating projects...');
        const projects = await ProjectGenerationStep.execute(quantities);
        
        // Step 3: Generate SPIs (which reference projects)
        console.log('Step 3: Generating SPIs...');
        const spis = await SPIGenerationStep.execute(quantities, projects);
        
        // Step 4: Generate objectives
        console.log('Step 4: Generating objectives...');
        const objectives = generateSampleObjectives(quantities.objectives);
        if (!DataIntegrityChecker.validateObjectives(objectives)) {
          throw new Error('Objectives validation failed');
        }
        for (const objective of objectives) {
          await db.addObjective(objective);
          TransactionManager.addRollbackAction(async () => {
            await db.deleteObjective(objective.id);
          });
        }
        
        // Step 5: Generate sitreps (which reference SPIs)
        console.log('Step 5: Generating sitreps...');
        const sitreps = generateSampleSitReps(spis, quantities.sitreps);
        if (!DataIntegrityChecker.validateSitReps(sitreps)) {
          throw new Error('SitReps validation failed');
        }
        for (const sitrep of sitreps) {
          await db.addSitRep(sitrep);
          TransactionManager.addRollbackAction(async () => {
            await db.deleteSitRep(sitrep.id);
          });
        }

        console.log('Final generation results:', {
          fortune30Partners: fortune30Partners.length,
          internalPartners: internalPartners.length,
          smePartners: smePartners.length,
          projects: projects.length,
          spis: spis.length,
          objectives: objectives.length,
          sitreps: sitreps.length
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
      },
      async () => {
        await db.clear();
      }
    );
  }
}