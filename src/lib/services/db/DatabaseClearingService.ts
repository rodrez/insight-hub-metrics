import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { toast } from "@/components/ui/use-toast";

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Close all existing connections first
      connectionManager.closeAllConnections();
      
      // Get all store names from the database
      const storeNames = Array.from(this.db.objectStoreNames);
      
      if (storeNames.length === 0) {
        console.warn('No stores found in database');
        return;
      }

      // Clear each store individually
      const clearPromises = storeNames.map(storeName => this.clearStore(storeName));
      await Promise.all(clearPromises);

      // Delete and recreate the database
      await DatabaseCleaner.clearDatabase();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
      
      console.log('Database cleared successfully');
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

  private async clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          console.log(`Store ${storeName} cleared successfully`);
          resolve();
        };

        request.onerror = () => {
          console.error(`Error clearing store ${storeName}:`, request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(error);
      }
    });
  }
}