import { DataQuantities } from '@/lib/types/data';
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { PartnerGenerationStep } from './steps/PartnerGenerationStep';
import { ProjectGenerationStep } from './steps/ProjectGenerationStep';
import { SPIGenerationStep } from './steps/SPIGenerationStep';
import { generateSampleObjectives, generateSampleSitReps } from './spiGenerator';
import { DataIntegrityChecker } from '../validation/DataIntegrityChecker';
import { TransactionRollbackManager } from '../../db/transaction/TransactionRollbackManager';

export class SequentialDataGenerator {
  static async generateData(quantities: DataQuantities) {
    console.log('Starting sequential data generation with quantities:', quantities);
    const rollbackManager = TransactionRollbackManager.getInstance();
    
    return rollbackManager.executeWithRollback(async () => {
      // Step 1: Generate all partners first
      console.log('Step 1: Generating partners...');
      const { fortune30Partners, internalPartners, smePartners } = 
        await PartnerGenerationStep.execute(quantities);
      
      // Add rollback operations for partners
      fortune30Partners.forEach(partner => {
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteCollaborator(partner.id);
        });
      });

      internalPartners.forEach(partner => {
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteCollaborator(partner.id);
        });
      });

      smePartners.forEach(partner => {
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteSMEPartner(partner.id);
        });
      });
      
      // Step 2: Generate projects
      console.log('Step 2: Generating projects...');
      const projects = await ProjectGenerationStep.execute(quantities);
      
      // Add rollback operations for projects
      projects.forEach(project => {
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteProject(project.id);
        });
      });
      
      // Step 3: Generate SPIs
      console.log('Step 3: Generating SPIs...');
      const spis = await SPIGenerationStep.execute(quantities, projects);
      
      // Add rollback operations for SPIs
      spis.forEach(spi => {
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteSPI(spi.id);
        });
      });
      
      // Step 4: Generate objectives
      console.log('Step 4: Generating objectives...');
      const objectives = generateSampleObjectives(quantities.objectives);
      if (!DataIntegrityChecker.validateObjectives(objectives)) {
        throw new Error('Objectives validation failed');
      }
      
      for (const objective of objectives) {
        await db.addObjective(objective);
        rollbackManager.addRollbackOperation(async () => {
          await db.deleteObjective(objective.id);
        });
      }
      
      // Step 5: Generate sitreps
      console.log('Step 5: Generating sitreps...');
      const sitreps = generateSampleSitReps(spis, quantities.sitreps);
      if (!DataIntegrityChecker.validateSitReps(sitreps)) {
        throw new Error('SitReps validation failed');
      }
      
      for (const sitrep of sitreps) {
        await db.addSitRep(sitrep);
        rollbackManager.addRollbackOperation(async () => {
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
    });
  }
}