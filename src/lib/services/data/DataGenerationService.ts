import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { generateFortune30Partners } from './fortune30Partners';
import { generateInternalPartners } from './internalPartners';
import { generateSMEPartners } from './smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { SampleDataQuantities } from '../DataService';
import { db } from "@/lib/db";

export class DataGenerationService {
  private showSuccessStep(step: string) {
    toast({
      title: <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        {step}
      </div>,
      description: "Completed successfully",
      duration: 2000,
    });
  }

  private async generatePartners(quantities: SampleDataQuantities) {
    // Generate partners
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

  private async generateProjectData(quantities: SampleDataQuantities) {
    const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);
    
    this.showSuccessStep(`Generated ${projects.length} projects`);
    this.showSuccessStep(`Generated ${spis.length} SPIs`);
    this.showSuccessStep(`Generated ${objectives.length} objectives`);
    this.showSuccessStep(`Generated ${sitreps.length} sitreps`);

    return { projects, spis, objectives, sitreps };
  }

  private async saveToDatabase(
    transaction: IDBTransaction,
    storeName: string,
    data: any[]
  ) {
    return new Promise<void>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      
      // Clear existing data
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        let completed = 0;
        
        // Add new data
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

        // Handle empty data case
        if (data.length === 0) {
          resolve();
        }
      };
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async generateAndSaveData(quantities: SampleDataQuantities) {
    try {
      // Initialize database
      await db.init();
      this.showSuccessStep("Database initialized");

      // Generate all data first
      const { fortune30Partners, internalPartners, smePartners } = await this.generatePartners(quantities);
      const { projects, spis, objectives, sitreps } = await this.generateProjectData(quantities);

      // Start database transaction
      const stores = ['collaborators', 'smePartners', 'projects', 'spis', 'objectives', 'sitreps'];
      const transaction = (db as any).getDatabase().transaction(stores, 'readwrite');

      // Save all data
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