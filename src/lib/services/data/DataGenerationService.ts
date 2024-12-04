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
  private showProgress(step: string, count: number) {
    console.log(`${step}: Generated ${count} items`);
    toast({
      title: step,
      description: `Generated ${count} items`,
      duration: 2000
    });
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
      await db.init();
      console.log('Database initialized successfully');
      
      // Clear existing data
      await this.clearAllData();
      console.log('Database cleared successfully');
      this.showProgress("Database cleared", 0);

      // Convert readonly array to mutable array
      const departments: Department[] = [...DEPARTMENTS];
      console.log('Departments loaded:', departments.length);

      // Step 1: Generate and save Fortune 30 partners
      console.log('Starting Fortune 30 partners generation...');
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      console.log(`Generated ${fortune30Partners.length} Fortune 30 partners`);
      
      for (const partner of fortune30Partners) {
        console.log(`Adding Fortune 30 partner: ${partner.name}`);
        if (!validateCollaborator(partner)) {
          throw new Error(`Invalid Fortune 30 partner data: ${partner.name}`);
        }
        await db.addCollaborator(partner);
      }
      this.showProgress("Fortune 30 Partners", fortune30Partners.length);

      // Step 2: Generate and save internal partners
      console.log('Starting internal partners generation...');
      const internalPartners = await generateInternalPartners();
      const selectedInternalPartners = internalPartners.slice(0, quantities.internalPartners);
      console.log(`Generated ${selectedInternalPartners.length} internal partners`);
      
      for (const partner of selectedInternalPartners) {
        console.log(`Adding internal partner: ${partner.name}`);
        if (!validateCollaborator(partner)) {
          throw new Error(`Invalid internal partner data: ${partner.name}`);
        }
        await db.addCollaborator(partner);
      }
      this.showProgress("Internal Partners", selectedInternalPartners.length);

      // Step 3: Generate and save SME partners
      console.log('Starting SME partners generation...');
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      console.log(`Generated ${smePartners.length} SME partners`);
      
      for (const partner of smePartners) {
        console.log(`Adding SME partner: ${partner.name}`);
        if (!validateCollaborator(partner)) {
          throw new Error(`Invalid SME partner data: ${partner.name}`);
        }
        await db.addSMEPartner(partner);
      }
      this.showProgress("SME Partners", smePartners.length);

      // Step 4: Generate and save projects
      console.log('Starting projects generation...');
      const projects = generateProjects(departments, quantities.projects);
      const projectIds: string[] = [];
      console.log(`Generated ${projects.length} projects`);
      
      for (const project of projects) {
        console.log(`Adding project: ${project.name}`);
        if (!validateProject(project)) {
          throw new Error(`Invalid project data: ${project.name}`);
        }
        await db.addProject(project);
        projectIds.push(project.id);
      }
      this.showProgress("Projects", projects.length);

      // Step 5: Generate and save SPIs using project IDs
      console.log('Starting SPIs generation...');
      const spis = generateSampleSPIs(projectIds, quantities.spis);
      const spiIds: string[] = [];
      console.log(`Generated ${spis.length} SPIs`);
      
      for (const spi of spis) {
        console.log(`Adding SPI: ${spi.name}`);
        await db.addSPI(spi);
        spiIds.push(spi.id);
      }
      this.showProgress("SPIs", spis.length);

      // Step 6: Generate and save objectives
      console.log('Starting objectives generation...');
      const objectives = generateSampleObjectives(quantities.objectives);
      console.log(`Generated ${objectives.length} objectives`);
      
      for (const objective of objectives) {
        console.log(`Adding objective: ${objective.title}`);
        await db.addObjective(objective);
      }
      this.showProgress("Objectives", objectives.length);

      // Step 7: Generate and save sitreps using SPI IDs
      console.log('Starting sitreps generation...');
      const sitreps = generateSampleSitReps(spis, quantities.sitreps);
      console.log(`Generated ${sitreps.length} sitreps`);
      
      for (const sitrep of sitreps) {
        console.log(`Adding sitrep: ${sitrep.title}`);
        await db.addSitRep(sitrep);
      }
      this.showProgress("SitReps", sitreps.length);

      // Final success notification
      toast({
        title: "Success",
        description: `Generated ${projects.length} projects, ${spis.length} SPIs, ${objectives.length} objectives, ${sitreps.length} sitreps, ${fortune30Partners.length} Fortune 30 partners, ${selectedInternalPartners.length} internal partners, and ${smePartners.length} SME partners`,
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
        await this.clearAllData();
        console.log('Cleaned up data after failure');
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
      
      return { success: false, error };
    }
  }

  private async clearAllData(): Promise<void> {
    const database = db.getDatabase();
    if (!database) throw new Error('Database not initialized');

    const stores = ['collaborators', 'smePartners', 'projects', 'spis', 'objectives', 'sitreps'];
    
    for (const store of stores) {
      await this.clearStore(database, store);
      console.log(`Cleared store: ${store}`);
    }
  }

  private async clearStore(database: IDBDatabase, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log(`Successfully cleared store: ${storeName}`);
        resolve();
      };
      request.onerror = () => {
        console.error(`Failed to clear ${storeName}`);
        reject(new Error(`Failed to clear ${storeName}`));
      };
    });
  }
}