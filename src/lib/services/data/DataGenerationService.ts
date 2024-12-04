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

export class DataGenerationService {
  private showSuccessStep(step: string) {
    console.log(`Completed step: ${step}`);
    toast({
      title: step,
      description: "Completed successfully",
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
      console.log('Starting data generation with quantities:', quantities);
      await db.init();
      
      // Clear existing data
      await this.clearAllData();
      this.showSuccessStep("Cleared existing data");

      // Generate all data
      console.log('Generating partners...');
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      const internalPartners = (await generateInternalPartners()).slice(0, quantities.internalPartners);
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      
      console.log('Generating projects...');
      const projects = generateProjects(DEPARTMENTS, quantities.projects);
      
      console.log('Generating SPIs and related data...');
      const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
      const objectives = generateSampleObjectives(quantities.objectives);
      const sitreps = generateSampleSitReps(spis, quantities.sitreps);

      // Save Fortune 30 partners
      console.log('Saving Fortune 30 partners...');
      for (const partner of fortune30Partners) {
        await db.addCollaborator(partner);
      }
      this.showSuccessStep("Saved Fortune 30 partners");

      // Save internal partners
      console.log('Saving internal partners...');
      for (const partner of internalPartners) {
        await db.addCollaborator(partner);
      }
      this.showSuccessStep("Saved internal partners");

      // Save SME partners
      console.log('Saving SME partners...');
      for (const partner of smePartners) {
        await db.addSMEPartner(partner);
      }
      this.showSuccessStep("Saved SME partners");

      // Save projects
      console.log('Saving projects...');
      for (const project of projects) {
        await db.addProject(project);
      }
      this.showSuccessStep("Saved projects");

      // Save SPIs
      console.log('Saving SPIs...');
      for (const spi of spis) {
        await db.addSPI(spi);
      }
      this.showSuccessStep("Saved SPIs");

      // Save objectives
      console.log('Saving objectives...');
      for (const objective of objectives) {
        await db.addObjective(objective);
      }
      this.showSuccessStep("Saved objectives");

      // Save sitreps
      console.log('Saving sitreps...');
      for (const sitrep of sitreps) {
        await db.addSitRep(sitrep);
      }
      this.showSuccessStep("Saved sitreps");

      toast({
        title: "Success",
        description: "All data generated and saved successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error in generateAndSaveData:', error);
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Data Generation Failed',
      });
      return { success: false, error };
    }
  }

  private async clearAllData(): Promise<void> {
    const database = db.getDatabase();
    if (!database) throw new Error('Database not initialized');

    const stores = ['collaborators', 'smePartners', 'projects', 'spis', 'objectives', 'sitreps'];
    
    for (const store of stores) {
      await this.clearStore(database, store);
    }
  }

  private async clearStore(database: IDBDatabase, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    });
  }
}