import { toast } from "@/components/ui/use-toast";
import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';
import { DatabaseError } from '../../utils/errorHandling';
import { DB_CONFIG } from './stores';
import { TransactionQueueManager } from './TransactionQueueManager';

export class DatabaseClearingService {
  private db: IDBDatabase | null;
  private transactionQueue: TransactionQueueManager;

  constructor(db: IDBDatabase | null) {
    this.db = db;
    this.transactionQueue = TransactionQueueManager.getInstance();
  }

  private async validateConnection(): Promise<boolean> {
    if (!this.db) {
      console.log('No database connection found');
      return false;
    }

    try {
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
      
      const storeNames = Object.values(DB_CONFIG.stores);
      
      if (storeNames.length === 0) {
        console.warn('No stores found in database');
        return;
      }

      console.log('Clearing stores sequentially...');
      for (const storeName of storeNames) {
        await this.clearStore(storeName);
      }

      console.log('Cleaning up database...');
      await DatabaseCleaner.clearDatabase();
      
      // Clear the transaction queue after successful database clearing
      this.transactionQueue.clearQueue();
      
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

      this.transactionQueue.enqueueTransaction(async () => {
        try {
          console.log(`Clearing store: ${storeName}`);
          const transaction = this.db!.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);

          await new Promise<void>((resolveStore, rejectStore) => {
            const request = store.clear();

            request.onsuccess = () => {
              console.log(`Store ${storeName} cleared successfully`);
              resolveStore();
            };

            request.onerror = () => {
              console.error(`Error clearing store ${storeName}:`, request.error);
              rejectStore(new DatabaseError(`Failed to clear store ${storeName}`));
            };
          });

          resolve();
        } catch (error) {
          console.error(`Error accessing store ${storeName}:`, error);
          reject(new DatabaseError(`Error accessing store ${storeName}`));
        }
      }, 2); // Higher priority for clearing operations
    });
  }
}