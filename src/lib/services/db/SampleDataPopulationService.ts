import { SampleDataQuantities } from '../DataService';
import { BaseDBService } from './base/BaseDBService';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { generateSMEPartners } from '@/lib/services/data/smePartners';
import { generateSampleProjects } from '@/components/data/SampleData';
import { toast } from "@/components/ui/use-toast";
import { DB_CONFIG } from './stores';

export class SampleDataPopulationService extends BaseDBService {
  private async beginTransaction(): Promise<IDBTransaction> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.transaction(Object.values(DB_CONFIG.stores), 'readwrite');
  }

  private async populateStore(
    transaction: IDBTransaction,
    storeName: string,
    data: any[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      let completed = 0;

      data.forEach(item => {
        const request = store.put(item);
        request.onsuccess = () => {
          completed++;
          if (completed === data.length) resolve();
        };
        request.onerror = () => reject(request.error);
      });

      if (data.length === 0) resolve();
    });
  }

  async populateData(quantities: SampleDataQuantities): Promise<void> {
    let transaction: IDBTransaction | null = null;

    try {
      console.log('Starting sample data population...');
      
      // Generate all sample data first
      const fortune30Partners = generateFortune30Partners().slice(0, quantities.fortune30);
      const internalPartners = (await generateInternalPartners()).slice(0, quantities.internalPartners);
      const smePartners = generateSMEPartners().slice(0, quantities.smePartners);
      
      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);

      // Start transaction
      transaction = await this.beginTransaction();

      // Set up transaction event handlers
      transaction.onerror = () => {
        throw new Error('Transaction failed: ' + transaction?.error?.message);
      };

      // Populate all stores within the same transaction
      await Promise.all([
        this.populateStore(transaction, 'collaborators', fortune30Partners),
        this.populateStore(transaction, 'collaborators', internalPartners),
        this.populateStore(transaction, 'smePartners', smePartners),
        this.populateStore(transaction, 'projects', projects),
        this.populateStore(transaction, 'spis', spis),
        this.populateStore(transaction, 'objectives', objectives),
        this.populateStore(transaction, 'sitreps', sitreps),
      ]);

      toast({
        title: "Success",
        description: "Sample data populated successfully",
      });
    } catch (error) {
      console.error('Error populating sample data:', error);
      
      // Abort transaction if it exists
      if (transaction) {
        transaction.abort();
      }

      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive",
      });
      throw error;
    }
  }
}