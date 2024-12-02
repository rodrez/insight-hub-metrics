import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '../../utils/errorHandling';
import { STORE_NAMES } from './stores';
import { connectionManager } from './connectionManager';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

    try {
      const transaction = this.db.transaction(STORE_NAMES, 'readwrite');
      const stores = Array.from(STORE_NAMES);

      if (!stores || stores.length === 0) {
        throw new DatabaseError('No stores found to clear');
      }

      await Promise.all(
        stores.map(storeName => {
          return new Promise<void>((resolve, reject) => {
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
          });
        })
      );

      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }
}