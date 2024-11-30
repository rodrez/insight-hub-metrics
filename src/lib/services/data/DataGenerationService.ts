import { toast } from "@/components/ui/use-toast";
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from '@/components/data/SampleData';
import { DataQuantities, dataQuantitiesSchema } from '../../types/data';
import { db } from "@/lib/db";
import { errorHandler } from '../error/ErrorHandlingService';
import { validateCollaborator, validateProject } from './utils/dataGenerationUtils';

export class DataGenerationService {
  private showSuccessStep(step: string) {
    toast({
      title: step,
      description: "Completed successfully",
      duration: 2000
    });
  }

  private async generatePartners(quantities: DataQuantities) {
    try {
      const fortune30Partners = await Promise.resolve(generateFortune30Partners())
        .then(partners => partners.filter(validateCollaborator));
      this.showSuccessStep(`Generated ${fortune30Partners.length} Fortune 30 partners`);

      const internalPartners = await generateInternalPartners()
        .then(partners => partners.filter(validateCollaborator));
      const selectedInternalPartners = internalPartners.slice(0, quantities.internalPartners);
      this.showSuccessStep(`Generated ${selectedInternalPartners.length} internal partners`);

      const smePartners = await Promise.resolve(generateSMEPartners())
        .then(partners => partners.filter(validateCollaborator));
      const selectedSMEPartners = smePartners.slice(0, quantities.smePartners);
      this.showSuccessStep(`Generated ${selectedSMEPartners.length} SME partners`);

      return {
        fortune30Partners: fortune30Partners.slice(0, quantities.fortune30),
        internalPartners: selectedInternalPartners,
        smePartners: selectedSMEPartners
      };
    } catch (error) {
      errorHandler.handleError(error, {
        type: 'database',
        title: 'Partner Generation Failed',
      });
      throw error;
    }
  }

  async generateAndSaveData(): Promise<{ success: boolean; error?: any }> {
    try {
      await db.init();
      this.showSuccessStep("Database initialized");

      const defaultQuantities = dataQuantitiesSchema.parse({});
      const { fortune30Partners, internalPartners, smePartners } = await this.generatePartners(defaultQuantities);
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(defaultQuantities);

      const validatedProjects = projects.filter(validateProject);

      const stores = ['collaborators', 'smePartners', 'projects', 'spis', 'objectives', 'sitreps'];
      const transaction = (db as any).getDatabase().transaction(stores, 'readwrite');

      transaction.onerror = () => {
        errorHandler.handleError(transaction.error, {
          type: 'database',
          title: 'Transaction Failed'
        });
      };

      await Promise.all([
        this.saveToDatabase(transaction, 'collaborators', [...fortune30Partners, ...internalPartners]),
        this.saveToDatabase(transaction, 'smePartners', smePartners),
        this.saveToDatabase(transaction, 'projects', validatedProjects),
        this.saveToDatabase(transaction, 'spis', spis),
        this.saveToDatabase(transaction, 'objectives', objectives),
        this.saveToDatabase(transaction, 'sitreps', sitreps),
      ]);

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
