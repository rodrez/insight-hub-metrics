import { toast } from "@/components/ui/use-toast";
import { generateFortune30Partners } from './generators/fortune30Generator';
import { generateInternalPartners } from './generators/internalPartnersGenerator';
import { generateSMEPartners } from './generators/smePartnersGenerator';
import { generateSampleProjects } from '@/components/data/SampleData';
import { DataQuantities } from '../../types/data';
import { db } from "@/lib/db";

export class DataGenerationService {
  private showSuccessStep(step: string) {
    toast({
      title: step,
      description: "Completed successfully",
      duration: 2000
    });
  }

  private async generatePartners(quantities: DataQuantities) {
    const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
    this.showSuccessStep(`Generated ${fortune30Partners.length} Fortune 30 partners`);

    const internalPartners = await generateInternalPartners();
    const selectedInternalPartners = internalPartners.slice(0, quantities.internalPartners);
    this.showSuccessStep(`Generated ${selectedInternalPartners.length} internal partners`);

    const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
    this.showSuccessStep(`Generated ${smePartners.length} SME partners`);

    return {
      fortune30Partners,
      internalPartners: selectedInternalPartners,
      smePartners
    };
  }

  private async saveToDatabase(
    transaction: IDBTransaction,
    storeName: string,
    data: any[]
  ) {
    return new Promise<void>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        let completed = 0;
        
        data.forEach(item => {
          const request = store.put(item);
          request.onsuccess = () => {
            completed++;
            if (completed === data.length) {
              this.showSuccessStep(`Saved ${data.length} items to ${storeName}`);
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });

        if (data.length === 0) {
          resolve();
        }
      };
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async generateAndSaveData() {
    try {
      await db.init();
      this.showSuccessStep("Database initialized");

      const quantities: DataQuantities = {
        projects: 10,
        spis: 10,
        objectives: 5,
        sitreps: 10,
        fortune30: 6,
        internalPartners: 20,
        smePartners: 10
      };

      const { fortune30Partners, internalPartners, smePartners } = await this.generatePartners(quantities);
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);

      const stores = ['collaborators', 'smePartners', 'projects', 'spis', 'objectives', 'sitreps'];
      const transaction = (db as any).getDatabase().transaction(stores, 'readwrite');

      await Promise.all([
        this.saveToDatabase(transaction, 'collaborators', [...fortune30Partners, ...internalPartners]),
        this.saveToDatabase(transaction, 'smePartners', smePartners),
        this.saveToDatabase(transaction, 'projects', projects),
        this.saveToDatabase(transaction, 'spis', spis),
        this.saveToDatabase(transaction, 'objectives', objectives),
        this.saveToDatabase(transaction, 'sitreps', sitreps),
      ]);

      this.showSuccessStep("All data saved successfully");

      return { success: true };
    } catch (error) {
      console.error('Error generating data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate data",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }
}