import { toast } from "@/components/ui/use-toast";
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateProjects } from './generators/projectGenerator';
import { DataQuantities } from '@/lib/types/data';
import { db } from "@/lib/db";
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator, validateProject } from './utils/dataGenerationUtils';
import { DEPARTMENTS } from '@/lib/constants';

export class DataGenerationService {
  private showSuccessStep(step: string) {
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

      const fortune30Partners = generateFortune30Partners().filter(validateCollaborator);
      const internalPartners = generateInternalPartners().filter(validateCollaborator);
      const smePartners = generateSMEPartners().filter(validateCollaborator);

      const projects = generateProjects(Array.from(DEPARTMENTS), defaultQuantities.projects);

      const stores = ['collaborators', 'smePartners', 'projects'];
      const transaction = db.getDatabase().transaction(stores, 'readwrite');

      await this.saveToDatabase(transaction, 'collaborators', [...fortune30Partners, ...internalPartners]);
      await this.saveToDatabase(transaction, 'smePartners', smePartners);
      await this.saveToDatabase(transaction, 'projects', projects);

      this.showSuccessStep("All data saved successfully");
      return { success: true };
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Data Generation Failed',
      });
      return { success: false, error };
    }
  }

  private async saveToDatabase(
    transaction: IDBTransaction,
    storeName: string,
    data: any[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const store = transaction.objectStore(storeName);
        
        const clearRequest = store.clear();
        clearRequest.onerror = () => {
          const error = clearRequest.error?.message || `Failed to clear ${storeName}`;
          reject(new Error(error));
        };

        clearRequest.onsuccess = () => {
          let completed = 0;
          const total = data.length;
          
          if (total === 0) {
            resolve();
            return;
          }

          data.forEach(item => {
            const request = store.put(item);
            request.onsuccess = () => {
              completed++;
              if (completed === total) {
                this.showSuccessStep(`Saved ${total} items to ${storeName}`);
                resolve();
              }
            };
            request.onerror = () => {
              const error = request.error?.message || `Failed to save item to ${storeName}`;
              reject(new Error(error));
            };
          });
        };
      } catch (error) {
        reject(error);
      }
    });
  }
}
