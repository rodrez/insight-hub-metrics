import { toast } from "@/components/ui/use-toast";
import { DB_CONFIG } from './stores';
import { DatabaseStateManager } from './initialization/DatabaseStateManager';

export class DatabaseClearingService {
  constructor(private db: IDBDatabase | null) {}

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      console.log('Starting complete database clearing process...');
      
      // First, delete the entire database
      await this.deleteDatabase();
      
      // Then reinitialize with empty stores
      await this.reinitializeDatabase();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
      
      console.log('Database cleared and reinitialized successfully');
    } catch (error) {
      console.error('Error during database clearing:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }

  private async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Close current connection
      if (this.db) {
        this.db.close();
      }

      const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

      deleteRequest.onerror = () => {
        console.error('Error deleting database:', deleteRequest.error);
        reject(new Error('Failed to delete database'));
      };

      deleteRequest.onblocked = () => {
        console.warn('Database deletion blocked - waiting for connections to close');
        // Wait for connections to close
        setTimeout(() => resolve(), 1000);
      };

      deleteRequest.onsuccess = () => {
        console.log('Database deleted successfully');
        resolve();
      };
    });
  }

  private async reinitializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        console.error('Error reinitializing database:', request.error);
        reject(new Error('Failed to reinitialize database'));
      };

      request.onupgradeneeded = (event) => {
        console.log('Creating fresh database stores...');
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create all stores fresh
        Object.values(DB_CONFIG.stores).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            console.log(`Creating store: ${storeName}`);
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            
            // Add specific indexes for collaborators store
            if (storeName === 'collaborators') {
              store.createIndex('type', 'type', { unique: false });
              store.createIndex('department', 'department', { unique: false });
            }
          }
        });
      };

      request.onsuccess = () => {
        console.log('Database reinitialized successfully');
        this.db = request.result;
        DatabaseStateManager.getInstance().setDatabase(this.db);
        resolve();
      };
    });
  }
}