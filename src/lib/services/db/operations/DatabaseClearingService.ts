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
      console.error('Database not initialized during clear attempt');
      throw new DatabaseError('Database not initialized');
    }

    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners', 'teams'];
    
    try {
      console.log('Starting database clear operation');
      
      for (const storeName of stores) {
        console.log(`Clearing store: ${storeName}`);
        const transaction = this.db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        
        await new Promise<void>((resolve, reject) => {
          const request = objectStore.clear();
          
          request.onsuccess = () => {
            console.log(`Successfully cleared store: ${storeName}`);
            resolve();
          };
          
          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            console.error(`Error clearing store ${storeName}:`, error);
            reject(new DatabaseError(`Failed to clear store ${storeName}: ${error?.message}`));
          };
        });
      }
      
      console.log('All stores cleared successfully');
      this.initManager.resetService('IndexedDB');
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error clearing database:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast({
        title: "Error",
        description: `Failed to clear database: ${errorMessage}`,
        variant: "destructive",
      });
      
      throw error instanceof DatabaseError ? error : new DatabaseError(errorMessage);
    }
  }
}