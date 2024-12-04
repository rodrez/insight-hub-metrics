import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '../../utils/errorHandling';
import { DB_CONFIG } from './stores';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    try {
      // Initialize database if not already initialized
      if (!this.db) {
        console.log('Database not initialized, attempting initialization...');
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
        
        this.db = await new Promise((resolve, reject) => {
          request.onerror = () => reject(new DatabaseError('Failed to initialize database'));
          request.onsuccess = () => {
            console.log('Database initialized successfully');
            resolve(request.result);
          };
        });
      }

      console.log('Closing existing connections...');
      // Close existing connections first
      connectionManager.closeAllConnections();
      
      // Get all store names from DB_CONFIG.stores
      const storeNames = Object.values(DB_CONFIG.stores);
      
      if (storeNames.length === 0) {
        console.warn('No stores found in database');
        return;
      }

      console.log('Clearing stores sequentially...');
      // Clear stores sequentially to avoid transaction conflicts
      for (const storeName of storeNames) {
        await this.clearStore(storeName);
      }

      console.log('Cleaning up database...');
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
      if (!this.db) {
        reject(new DatabaseError('Database not initialized'));
        return;
      }

      try {
        console.log(`Clearing store: ${storeName}`);
        const transaction = this.db.transaction(storeName, 'readwrite');
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