import { toast } from "@/components/ui/use-toast";
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './generators/spiGenerator';
import { DataQuantities } from '@/lib/types/data';
import { db } from "@/lib/db";
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator, validateProject } from './utils/dataGenerationUtils';
import { DEPARTMENTS } from '@/lib/constants';
import { Department } from '@/lib/types';

export class DataGenerationService {
  private async verifyDatabaseConnection(): Promise<void> {
    console.log('Verifying database connection...');
    if (!db.getDatabase()) {
      console.log('Database not initialized, initializing...');
      await db.init();
    }
    console.log('Database connection verified');
  }

  private async clearExistingData(): Promise<void> {
    console.log('Clearing existing data...');
    await db.clear();
    console.log('Existing data cleared successfully');
  }

  private async generateAndSaveInternalPartners(quantity: number) {
    console.log(`Generating ${quantity} internal partners...`);
    const internalPartners = await generateInternalPartners();
    const selectedPartners = internalPartners.slice(0, quantity);
    
    console.log(`Saving ${selectedPartners.length} internal partners...`);
    for (const partner of selectedPartners) {
      if (!validateCollaborator(partner)) {
        throw new Error(`Invalid internal partner data: ${partner.name}`);
      }
      await db.addCollaborator(partner);
    }
    
    console.log('Internal partners saved successfully');
    return selectedPartners;
  }

  private async generateAndSaveFortune30Partners(quantity: number) {
    console.log(`Generating ${quantity} Fortune 30 partners...`);
    const fortune30Partners = generateFortune30Partners().slice(0, quantity);
    
    console.log(`Saving ${fortune30Partners.length} Fortune 30 partners...`);
    for (const partner of fortune30Partners) {
      if (!validateCollaborator(partner)) {
        throw new Error(`Invalid Fortune 30 partner data: ${partner.name}`);
      }
      await db.addCollaborator(partner);
    }
    
    console.log('Fortune 30 partners saved successfully');
    return fortune30Partners;
  }

  private async generateAndSaveSMEPartners(quantity: number) {
    console.log(`Generating ${quantity} SME partners...`);
    const smePartners = generateSMEPartners().slice(0, quantity);
    
    console.log(`Saving ${smePartners.length} SME partners...`);
    for (const partner of smePartners) {
      if (!validateCollaborator(partner)) {
        throw new Error(`Invalid SME partner data: ${partner.name}`);
      }
      await db.addSMEPartner(partner);
    }
    
    console.log('SME partners saved successfully');
    return smePartners;
  }

  private async generateAndSaveProjects(quantity: number, departments: Department[]) {
    console.log(`Generating ${quantity} projects...`);
    const projects = generateProjects(departments, quantity);
    
    console.log(`Saving ${projects.length} projects...`);
    for (const project of projects) {
      if (!validateProject(project)) {
        throw new Error(`Invalid project data: ${project.name}`);
      }
      await db.addProject(project);
    }
    
    console.log('Projects saved successfully');
    return projects;
  }

  private async generateAndSaveSPIs(quantity: number, projectIds: string[]) {
    console.log(`Generating ${quantity} SPIs...`);
    const spis = generateSampleSPIs(projectIds, quantity);
    
    console.log(`Saving ${spis.length} SPIs...`);
    for (const spi of spis) {
      await db.addSPI(spi);
    }
    
    console.log('SPIs saved successfully');
    return spis;
  }

  private async generateAndSaveObjectives(quantity: number) {
    console.log(`Generating ${quantity} objectives...`);
    const objectives = generateSampleObjectives(quantity);
    
    console.log(`Saving ${objectives.length} objectives...`);
    for (const objective of objectives) {
      await db.addObjective(objective);
    }
    
    console.log('Objectives saved successfully');
    return objectives;
  }

  private async generateAndSaveSitReps(spis: any[], quantity: number) {
    console.log(`Generating ${quantity} sitreps...`);
    const sitreps = generateSampleSitReps(spis, quantity);
    
    console.log(`Saving ${sitreps.length} sitreps...`);
    for (const sitrep of sitreps) {
      await db.addSitRep(sitrep);
    }
    
    console.log('SitReps saved successfully');
    return sitreps;
  }

  async generateAndSaveData(quantities: DataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }): Promise<{ success: boolean; error?: any }> {
    try {
      console.log('Starting sequential data generation with quantities:', quantities);
      
      // Step 1: Verify database connection
      await this.verifyDatabaseConnection();
      
      // Step 2: Clear existing data
      await this.clearExistingData();
      toast({ title: "Database cleared", description: "Starting data generation..." });

      // Step 3: Generate and save internal partners (required for projects)
      const internalPartners = await this.generateAndSaveInternalPartners(quantities.internalPartners);
      toast({ title: "Progress", description: `Generated ${internalPartners.length} internal partners` });

      // Step 4: Generate and save Fortune 30 partners
      const fortune30Partners = await this.generateAndSaveFortune30Partners(quantities.fortune30);
      toast({ title: "Progress", description: `Generated ${fortune30Partners.length} Fortune 30 partners` });

      // Step 5: Generate and save SME partners
      const smePartners = await this.generateAndSaveSMEPartners(quantities.smePartners);
      toast({ title: "Progress", description: `Generated ${smePartners.length} SME partners` });

      // Step 6: Generate and save projects (depends on partners)
      const departments: Department[] = [...DEPARTMENTS];
      const projects = await this.generateAndSaveProjects(quantities.projects, departments);
      toast({ title: "Progress", description: `Generated ${projects.length} projects` });

      // Step 7: Generate and save SPIs (depends on projects)
      const spis = await this.generateAndSaveSPIs(
        quantities.spis,
        projects.map(p => p.id)
      );
      toast({ title: "Progress", description: `Generated ${spis.length} SPIs` });

      // Step 8: Generate and save objectives
      const objectives = await this.generateAndSaveObjectives(quantities.objectives);
      toast({ title: "Progress", description: `Generated ${objectives.length} objectives` });

      // Step 9: Generate and save sitreps (depends on SPIs)
      const sitreps = await this.generateAndSaveSitReps(spis, quantities.sitreps);
      toast({ title: "Progress", description: `Generated ${sitreps.length} sitreps` });

      // Final success notification
      toast({
        title: "Success",
        description: "All data generated and saved successfully",
      });

      console.log('Data generation completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in generateAndSaveData:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate data",
        variant: "destructive",
      });
      
      // Attempt to clean up on failure
      try {
        await this.clearExistingData();
        console.log('Cleaned up data after failure');
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
      
      return { success: false, error };
    }
  }
}