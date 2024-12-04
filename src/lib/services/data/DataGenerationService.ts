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
      
      // Clear existing data
      await this.clearAllData();
      this.showProgress("Database cleared", 0);

      // Convert readonly array to mutable array
      const departments: Department[] = [...DEPARTMENTS];

      // Step 1: Generate and save Fortune 30 partners
      console.log('Generating Fortune 30 partners...');
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      for (const partner of fortune30Partners) {
        await db.addCollaborator(partner);
      }
      this.showProgress("Fortune 30 Partners", fortune30Partners.length);

      // Step 2: Generate and save internal partners
      console.log('Generating internal partners...');
      const internalPartners = await generateInternalPartners();
      const selectedInternalPartners = internalPartners.slice(0, quantities.internalPartners);
      for (const partner of selectedInternalPartners) {
        await db.addCollaborator(partner);
      }
      this.showProgress("Internal Partners", selectedInternalPartners.length);

      // Step 3: Generate and save SME partners
      console.log('Generating SME partners...');
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      for (const partner of smePartners) {
        await db.addSMEPartner(partner);
      }
      this.showProgress("SME Partners", smePartners.length);

      // Step 4: Generate and save projects
      console.log('Generating projects...');
      const projects = generateProjects(departments, quantities.projects);
      for (const project of projects) {
        console.log('Saving project:', project.id);
        await db.addProject(project);
      }
      this.showProgress("Projects", projects.length);

      // Step 5: Generate and save SPIs using project IDs
      console.log('Generating SPIs...');
      const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
      for (const spi of spis) {
        console.log('Saving SPI:', spi.id);
        await db.addSPI(spi);
      }
      this.showProgress("SPIs", spis.length);

      // Step 6: Generate and save objectives
      console.log('Generating objectives...');
      const objectives = generateSampleObjectives(quantities.objectives);
      for (const objective of objectives) {
        console.log('Saving objective:', objective.id);
        await db.addObjective(objective);
      }
      this.showProgress("Objectives", objectives.length);

      // Step 7: Generate and save sitreps using SPI IDs
      console.log('Generating sitreps...');
      const sitreps = generateSampleSitReps(spis, quantities.sitreps);
      for (const sitrep of sitreps) {
        console.log('Saving sitrep:', sitrep.id);
        await db.addSitRep(sitrep);
      }
      this.showProgress("SitReps", sitreps.length);

      // Final success notification
      toast({
        title: "Success",
        description: `Generated ${projects.length} projects, ${spis.length} SPIs, ${objectives.length} objectives, ${sitreps.length} sitreps, ${fortune30Partners.length} Fortune 30 partners, ${selectedInternalPartners.length} internal partners, and ${smePartners.length} SME partners`,
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