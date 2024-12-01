import { toast } from "@/components/ui/use-toast";
import { ServiceInitializationManager } from "../initialization/ServiceInitializationManager";

export class DatabaseClearingService {
  constructor(
    private db: IDBDatabase | null,
    private initManager: ServiceInitializationManager
  ) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners', 'teams'];
    
    try {
      for (const storeName of stores) {
        const transaction = this.db?.transaction(storeName, 'readwrite');
        if (transaction) {
          const objectStore = transaction.objectStore(storeName);
          await objectStore.clear();
        }
      }
      
      this.initManager.resetService('IndexedDB');
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }
}