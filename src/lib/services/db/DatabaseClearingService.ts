import { toast } from "@/components/ui/use-toast";
import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { DatabaseError } from '../../utils/errorHandling';
import { DB_CONFIG } from './stores';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  private async validateConnection(): Promise<boolean> {
    if (!this.db) {
      console.log('No database connection found');
      return false;
    }

    try {
      // Try a simple transaction to verify connection
      const transaction = this.db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      await new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(false);
      });
      console.log('Database connection validated successfully');
      return true;
    } catch (error) {
      console.error('Database connection validation failed:', error);
      return false;
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      console.log('Starting database clearing process...');
      
      // Validate or establish connection
      const isConnected = await this.validateConnection();
      if (!isConnected) {
        console.log('Attempting to establish new database connection...');
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
        
        this.db = await new Promise((resolve, reject) => {
          request.onerror = () => {
            console.error('Failed to establish database connection');
            reject(new DatabaseError('Failed to initialize database'));
          };
          request.onsuccess = () => {
            console.log('New database connection established');
            resolve(request.result);
          };
        });
      }

      console.log('Closing existing connections...');
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
      await DatabaseCleaner.clearDatabase();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
      
      console.log('Database cleared successfully');
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

  private clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Database not initialized during store clearing');
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
          console.error(`Transaction error clearing store ${storeName}`);
          reject(new DatabaseError(`Transaction error clearing store ${storeName}`));
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(new DatabaseError(`Error accessing store ${storeName}`));
      }
    });
  }
}