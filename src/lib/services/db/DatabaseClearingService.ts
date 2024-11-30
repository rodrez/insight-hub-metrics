import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';

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

      // Clear each store individually to avoid transaction issues
      for (const storeName of storeNames) {
        await this.clearStore(storeName);
      }

      // Delete and recreate the database
      await DatabaseCleaner.clearDatabase();
      
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  private async clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        transaction.oncomplete = () => {
          console.log(`Store ${storeName} cleared successfully`);
          resolve();
        };

        transaction.onerror = () => {
          console.error(`Error clearing store ${storeName}:`, transaction.error);
          reject(transaction.error);
        };
      } catch (error) {
        console.error(`Error accessing store ${storeName}:`, error);
        reject(error);
      }
    });
  }
}