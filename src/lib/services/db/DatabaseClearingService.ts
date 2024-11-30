import { toast } from "@/components/ui/use-toast";
import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { DB_CONFIG } from './stores';

export class DatabaseClearingService {
  private db: IDBDatabase | null;

  constructor(db: IDBDatabase | null) {
    this.db = db;
  }

  async clearDatabase(): Promise<void> {
    try {
      // Close all existing connections first
      connectionManager.closeAllConnections();
      
      if (this.db) {
        // Get all store names from the database
        const storeNames = Array.from(this.db.objectStoreNames);
        
        // Create a transaction that includes all stores
        const transaction = this.db.transaction(storeNames, 'readwrite');
        
        // Clear each store
        await Promise.all(
          storeNames.map(storeName => 
            new Promise<void>((resolve, reject) => {
              const store = transaction.objectStore(storeName);
              const request = store.clear();
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            })
          )
        );

        // Wait for transaction to complete
        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      }

      // Delete and recreate the database
      await DatabaseCleaner.clearDatabase();
      
      toast({
        title: "Database cleared",
        description: "All data has been successfully removed.",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }
}