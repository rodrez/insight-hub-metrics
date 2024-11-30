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
      connectionManager.closeAllConnections();
      
      // Ensure all stores are cleared, including smePartners
      if (this.db) {
        const transaction = this.db.transaction(
          Object.values(DB_CONFIG.stores),
          'readwrite'
        );

        await Promise.all(
          Object.values(DB_CONFIG.stores).map(
            storeName => 
              new Promise<void>((resolve, reject) => {
                const store = transaction.objectStore(storeName);
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
              })
          )
        );
      }

      await DatabaseCleaner.clearDatabase();
      this.db = null;

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