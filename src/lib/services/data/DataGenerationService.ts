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

  async generateAndSaveData(): Promise<{ success: boolean; error?: any }> {
    try {
      await db.init();
      this.showSuccessStep("Database initialized");

      const defaultQuantities: Required<DataQuantities> = {
        projects: 10,
        spis: 10,
        objectives: 5,
        sitreps: 10,
        fortune30: 6,
        internalPartners: 20,
        smePartners: 10
      };

      // Generate all data first
      console.log('Generating partners...');
      const fortune30Partners = generateFortune30Partners().slice(0, defaultQuantities.fortune30);
      const internalPartners = (await generateInternalPartners()).slice(0, defaultQuantities.internalPartners);
      const smePartners = generateSMEPartners().slice(0, defaultQuantities.smePartners);
      
      console.log('Generating projects...');
      const projects = generateProjects(Array.from(DEPARTMENTS), defaultQuantities.projects);
      
      console.log('Generating SPIs and related data...');
      const spis = generateSampleSPIs(projects.map(p => p.id), defaultQuantities.spis);
      const objectives = generateSampleObjectives(defaultQuantities.objectives);
      const sitreps = generateSampleSitReps(spis, defaultQuantities.sitreps);

      // Save all data in sequence
      const database = db.getDatabase();
      if (!database) throw new Error('Database not initialized');

      // Clear existing data
      await Promise.all([
        this.clearStore(database, 'collaborators'),
        this.clearStore(database, 'smePartners'),
        this.clearStore(database, 'projects'),
        this.clearStore(database, 'spis'),
        this.clearStore(database, 'objectives'),
        this.clearStore(database, 'sitreps')
      ]);

      // Save new data
      await this.saveToStore(database, 'collaborators', [...fortune30Partners, ...internalPartners]);
      this.showSuccessStep("Saved partners");

      await this.saveToStore(database, 'smePartners', smePartners);
      this.showSuccessStep("Saved SME partners");

      await this.saveToStore(database, 'projects', projects);
      this.showSuccessStep("Saved projects");

      await this.saveToStore(database, 'spis', spis);
      this.showSuccessStep("Saved SPIs");

      await this.saveToStore(database, 'objectives', objectives);
      this.showSuccessStep("Saved objectives");

      await this.saveToStore(database, 'sitreps', sitreps);
      this.showSuccessStep("Saved sitreps");

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

  private async clearStore(database: IDBDatabase, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
    });
  }

  private async saveToStore(database: IDBDatabase, storeName: string, data: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      let completed = 0;
      const total = data.length;
      
      if (total === 0) {
        resolve();
        return;
      }

      data.forEach(item => {
        const request = store.add(item);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            console.log(`Successfully saved ${total} items to ${storeName}`);
            resolve();
          }
        };
        request.onerror = () => {
          console.error(`Failed to save item to ${storeName}:`, item);
          reject(new Error(`Failed to save item to ${storeName}`));
        };
      });

      transaction.onerror = () => {
        reject(new Error(`Transaction failed for ${storeName}`));
      };
    });
  }
}