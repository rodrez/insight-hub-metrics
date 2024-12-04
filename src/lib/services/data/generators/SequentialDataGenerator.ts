import { DataIntegrityChecker } from "../validation/DataIntegrityChecker";
import { TransactionManager } from "../transaction/TransactionManager";
import { generateInternalPartners } from './internalPartnersGenerator';
import { generateFortune30Partners } from './fortune30Generator';
import { generateSMEPartners } from './smePartnersGenerator';
import { generateProjects } from './projectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiGenerator';
import { DataQuantities } from '@/lib/types/data';
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

export class SequentialDataGenerator {
  static async generateData(quantities: DataQuantities) {
    return TransactionManager.executeInTransaction(
      async () => {
        // Step 1: Generate and validate internal partners
        console.log('Generating internal partners...');
        const internalPartners = await this.generateAndValidateInternalPartners(quantities.internalPartners);
        
        // Step 2: Generate and validate Fortune 30 partners
        console.log('Generating Fortune 30 partners...');
        const fortune30Partners = await this.generateAndValidateFortune30Partners(quantities.fortune30);
        
        // Step 3: Generate and validate SME partners
        console.log('Generating SME partners...');
        const smePartners = await this.generateAndValidateSMEPartners(quantities.smePartners);
        
        // Step 4: Generate and validate projects
        console.log('Generating projects...');
        const projects = await this.generateAndValidateProjects(quantities.projects);
        
        // Step 5: Generate and validate SPIs
        console.log('Generating SPIs...');
        const spis = await this.generateAndValidateSPIs(quantities.spis, projects);
        
        // Step 6: Generate and validate objectives
        console.log('Generating objectives...');
        const objectives = await this.generateAndValidateObjectives(quantities.objectives);
        
        // Step 7: Generate and validate sitreps
        console.log('Generating sitreps...');
        const sitreps = await this.generateAndValidateSitReps(quantities.sitreps, spis);

        return {
          internalPartners,
          fortune30Partners,
          smePartners,
          projects,
          spis,
          objectives,
          sitreps
        };
      },
      async () => {
        // Rollback action: clear all data
        await db.clear();
      }
    );
  }

  private static async generateAndValidateInternalPartners(quantity: number) {
    const partners = await generateInternalPartners();
    const selectedPartners = partners.slice(0, quantity);
    
    if (!DataIntegrityChecker.validateInternalPartners(selectedPartners)) {
      throw new Error('Internal partners validation failed');
    }

    for (const partner of selectedPartners) {
      await db.addCollaborator(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteCollaborator(partner.id);
      });
    }

    return selectedPartners;
  }

  private static async generateAndValidateFortune30Partners(quantity: number) {
    const partners = generateFortune30Partners().slice(0, quantity);
    
    if (!DataIntegrityChecker.validateFortune30Partners(partners)) {
      throw new Error('Fortune 30 partners validation failed');
    }

    for (const partner of partners) {
      await db.addCollaborator(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteCollaborator(partner.id);
      });
    }

    return partners;
  }

  private static async generateAndValidateSMEPartners(quantity: number) {
    const partners = generateSMEPartners().slice(0, quantity);
    
    if (!DataIntegrityChecker.validateSMEPartners(partners)) {
      throw new Error('SME partners validation failed');
    }

    for (const partner of partners) {
      await db.addSMEPartner(partner);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteSMEPartner(partner.id);
      });
    }

    return partners;
  }

  private static async generateAndValidateProjects(quantity: number) {
    const projects = generateProjects([...DEPARTMENTS], quantity);
    
    if (!DataIntegrityChecker.validateProjects(projects)) {
      throw new Error('Projects validation failed');
    }

    for (const project of projects) {
      await db.addProject(project);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteProject(project.id);
      });
    }

    return projects;
  }

  private static async generateAndValidateSPIs(quantity: number, projects: Project[]) {
    const spis = generateSampleSPIs(projects.map(p => p.id), quantity);
    
    if (!DataIntegrityChecker.validateSPIs(spis)) {
      throw new Error('SPIs validation failed');
    }

    for (const spi of spis) {
      await db.addSPI(spi);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteSPI(spi.id);
      });
    }

    return spis;
  }

  private static async generateAndValidateObjectives(quantity: number) {
    const objectives = generateSampleObjectives(quantity);
    
    if (!DataIntegrityChecker.validateObjectives(objectives)) {
      throw new Error('Objectives validation failed');
    }

    for (const objective of objectives) {
      await db.addObjective(objective);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteObjective(objective.id);
      });
    }

    return objectives;
  }

  private static async generateAndValidateSitReps(quantity: number, spis: SPI[]) {
    const sitreps = generateSampleSitReps(spis, quantity);
    
    if (!DataIntegrityChecker.validateSitReps(sitreps)) {
      throw new Error('SitReps validation failed');
    }

    for (const sitrep of sitreps) {
      await db.addSitRep(sitrep);
      TransactionManager.addRollbackAction(async () => {
        await db.deleteSitRep(sitrep.id);
      });
    }

    return sitreps;
  }
}