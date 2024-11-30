import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '../../utils/errorHandling';
import { DB_CONFIG } from './stores';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

    try {
      // Close existing connections first
      connectionManager.closeAllConnections();
      
      // Get all store names
      const storeNames = Array.from(DB_CONFIG.stores);
      
      if (storeNames.length === 0) {
        console.warn('No stores found in database');
        return;
      }

      // Clear stores sequentially to avoid transaction conflicts
      for (const storeName of Object.values(DB_CONFIG.stores)) {
        await this.clearStore(storeName);
      }

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
      throw new DatabaseError('Failed to clear database', error instanceof Error ? error : undefined);
    }
  }

  private clearStore(storeName: string): Promise<void> {
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
          reject(new DatabaseError(`Failed to clear store ${storeName}`));
        };

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(new DatabaseError(`Transaction error clearing store ${storeName}`));
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(new DatabaseError(`Error accessing store ${storeName}`));
      }
    });
  }
}