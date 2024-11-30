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
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Close all existing connections first
      connectionManager.closeAllConnections();
      
      // Get all store names from the database
      const storeNames = Array.from(this.db.objectStoreNames);
      
      if (storeNames.length === 0) {
        console.warn('No stores found in database');
        return;
      }

      // Create a transaction that includes all stores
      const transaction = this.db.transaction(storeNames, 'readwrite');
      
      // Clear each store
      const clearPromises = storeNames.map(storeName => 
        new Promise<void>((resolve, reject) => {
          try {
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = (event) => {
              console.error(`Error clearing store ${storeName}:`, event);
              reject(request.error);
            };
          } catch (error) {
            console.error(`Error accessing store ${storeName}:`, error);
            reject(error);
          }
        })
      );

      // Wait for all stores to be cleared
      await Promise.all(clearPromises).catch(error => {
        console.error('Error during store clearing:', error);
        throw error;
      });

      // Wait for transaction to complete
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log('All stores cleared successfully');
          resolve();
        };
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(transaction.error);
        };
        transaction.onabort = () => {
          console.error('Transaction aborted');
          reject(new Error('Transaction aborted'));
        };
      });

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