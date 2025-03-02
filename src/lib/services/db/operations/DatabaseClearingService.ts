import { toast } from "@/components/ui/use-toast";
import { ServiceInitializationManager } from "../initialization/ServiceInitializationManager";
import { DatabaseError } from '@/lib/utils/errorHandling';

export class DatabaseClearingService {
  constructor(
    private db: IDBDatabase | null,
    private initManager: ServiceInitializationManager
  ) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners', 'teams'];
    
    try {
      console.log('Starting database clearing process...');
      for (const storeName of stores) {
        try {
          const transaction = this.db.transaction(storeName, 'readwrite');
          const objectStore = transaction.objectStore(storeName);
          await new Promise<void>((resolve, reject) => {
            const request = objectStore.clear();
            request.onsuccess = () => {
              console.log(`Store ${storeName} cleared successfully`);
              resolve();
            };
            request.onerror = () => {
              console.warn(`Error clearing store ${storeName}:`, request.error);
              // Don't fail the entire operation if one store fails
              resolve();
            };
          });
        } catch (error) {
          console.warn(`Error accessing store ${storeName}:`, error);
          // Continue with other stores
        }
      }
      
      this.initManager.resetService('IndexedDB');
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error during database clearing:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw new DatabaseError('Failed to clear database', error instanceof Error ? error : undefined);
    }
  }
}