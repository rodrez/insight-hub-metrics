import { toast } from "@/components/ui/use-toast";
import { ServiceInitializationManager } from "../initialization/ServiceInitializationManager";
import { DB_CONFIG } from '../stores';
import { connectionManager } from '../connectionManager';

export class DatabaseClearingService {
  constructor(
    private db: IDBDatabase | null,
    private initManager: ServiceInitializationManager
  ) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // First, close all active connections
      console.log('Closing all active connections...');
      connectionManager.closeAllConnections();
      
      // Wait a bit to ensure connections are closed
      await new Promise(resolve => setTimeout(resolve, 100));

      const stores = Object.values(DB_CONFIG.stores);
      
      // Clear each store sequentially to avoid transaction conflicts
      for (const storeName of stores) {
        await this.clearStore(storeName);
      }

      // Close current database connection
      this.db.close();
      
      // Wait for any pending transactions
      await new Promise(resolve => setTimeout(resolve, 100));

      // Delete and recreate the database
      await this.recreateDatabase();
      
      // Reset the initialization state
      this.initManager.resetService('IndexedDB');
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
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

  private clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        console.log(`Clearing store: ${storeName}`);
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        transaction.oncomplete = () => {
          console.log(`Store ${storeName} cleared successfully`);
          resolve();
        };

        transaction.onerror = () => {
          console.error(`Error clearing store ${storeName}:`, transaction.error);
          reject(transaction.error);
        };

        const request = store.clear();
        request.onerror = () => {
          console.error(`Error in clear request for ${storeName}:`, request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(error);
      }
    });
  }

  private async recreateDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const maxRetries = 3;
      let currentRetry = 0;

      const attemptDeletion = () => {
        currentRetry++;
        console.log(`Attempting database deletion (attempt ${currentRetry}/${maxRetries})...`);

        // Ensure all connections are closed before deletion
        connectionManager.closeAllConnections();
        
        const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

        deleteRequest.onerror = () => {
          console.error('Error deleting database:', deleteRequest.error);
          if (currentRetry < maxRetries) {
            setTimeout(attemptDeletion, 1000);
          } else {
            reject(new Error(`Failed to delete database after ${maxRetries} attempts`));
          }
        };

        deleteRequest.onsuccess = () => {
          console.log('Database deleted successfully');
          resolve();
        };

        deleteRequest.onblocked = () => {
          console.warn('Database deletion blocked - closing all connections');
          connectionManager.closeAllConnections();
          if (currentRetry < maxRetries) {
            setTimeout(attemptDeletion, 1000);
          } else {
            reject(new Error(`Database deletion blocked after ${maxRetries} attempts`));
          }
        };
      };

      // Start deletion attempt after ensuring connections are closed
      setTimeout(attemptDeletion, 100);
    });
  }
}