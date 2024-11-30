import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '../../utils/errorHandling';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
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
      await Promise.all(storeNames.map(storeName => this.clearStore(storeName)));

      // Delete and recreate the database
      await DatabaseCleaner.clearDatabase();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
      
      console.log('Database cleared successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error clearing database:', errorMessage);
      toast({
        title: "Error",
        description: `Failed to clear database: ${errorMessage}`,
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

        transaction.onerror = (event) => {
          const error = (event.target as IDBTransaction).error;
          console.error(`Transaction error clearing store ${storeName}:`, error);
          reject(new DatabaseError(`Failed to clear store ${storeName}`, error || undefined));
        };

        const request = store.clear();

        request.onsuccess = () => {
          console.log(`Store ${storeName} cleared successfully`);
          resolve();
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error(`Error clearing store ${storeName}:`, error);
          reject(new DatabaseError(`Failed to clear store ${storeName}`, error || undefined));
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(new DatabaseError(`Error accessing store ${storeName}`, error instanceof Error ? error : undefined));
      }
    });
  }
}