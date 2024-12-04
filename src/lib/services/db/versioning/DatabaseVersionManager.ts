import { toast } from "@/components/ui/use-toast";
import { connectionManager } from '../connectionManager';
import { DB_CONFIG } from '../stores';

export class DatabaseVersionManager {
  private static instance: DatabaseVersionManager;
  private currentVersion: number = DB_CONFIG.version;
  private upgradeQueue: Promise<void> = Promise.resolve();

  private constructor() {}

  static getInstance(): DatabaseVersionManager {
    if (!DatabaseVersionManager.instance) {
      DatabaseVersionManager.instance = new DatabaseVersionManager();
    }
    return DatabaseVersionManager.instance;
  }

  async upgradeDatabase(): Promise<void> {
    // Queue the upgrade operation
    this.upgradeQueue = this.upgradeQueue.then(async () => {
      try {
        console.log('Starting database upgrade process...');
        
        // Close all existing connections
        await this.closeAllConnections();
        
        // Delete the existing database
        await this.deleteDatabase();
        
        // Open with new version
        await this.openNewVersion();
        
        console.log('Database upgrade completed successfully');
      } catch (error) {
        console.error('Error during database upgrade:', error);
        toast({
          title: "Database Error",
          description: "Failed to upgrade database. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    });

    return this.upgradeQueue;
  }

  private async closeAllConnections(): Promise<void> {
    console.log('Closing all database connections...');
    connectionManager.closeAllConnections();
    // Wait for connections to close
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

      deleteRequest.onerror = () => {
        console.error('Error deleting database:', deleteRequest.error);
        reject(new Error('Failed to delete database'));
      };

      deleteRequest.onblocked = () => {
        console.warn('Database deletion blocked - retrying...');
        this.closeAllConnections();
        // Retry after a short delay
        setTimeout(() => this.deleteDatabase().then(resolve).catch(reject), 100);
      };

      deleteRequest.onsuccess = () => {
        console.log('Database deleted successfully');
        resolve();
      };
    });
  }

  private async openNewVersion(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, this.currentVersion);

      request.onerror = () => {
        console.error('Error opening database:', request.error);
        reject(new Error('Failed to open database'));
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed, creating stores...');
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };

      request.onsuccess = () => {
        console.log('Database opened successfully with new version');
        resolve();
      };
    });
  }

  private createStores(db: IDBDatabase): void {
    // Create stores with proper indexes
    if (!db.objectStoreNames.contains('collaborators')) {
      const collaboratorsStore = db.createObjectStore('collaborators', { keyPath: 'id' });
      collaboratorsStore.createIndex('type', 'type', { unique: false });
      collaboratorsStore.createIndex('department', 'department', { unique: false });
    }

    // Create other stores
    const stores = ['projects', 'sitreps', 'spis', 'objectives', 'smePartners'];
    stores.forEach(storeName => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    });
  }
}