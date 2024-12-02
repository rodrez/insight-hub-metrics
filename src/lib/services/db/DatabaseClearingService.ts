import { ServiceInitializationManager } from './initialization/ServiceInitializationManager';
import { connectionManager } from './connectionManager';

export class DatabaseClearingService {
  private db: IDBDatabase | null;
  private initManager: ServiceInitializationManager;
  private readonly STORE_NAMES = [
    'projects',
    'collaborators',
    'sitreps',
    'spis',
    'objectives',
    'smePartners',
    'initiatives',
    'teams'
  ];

  constructor(db: IDBDatabase | null, initManager: ServiceInitializationManager) {
    this.db = db;
    this.initManager = initManager;
  }

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Close existing connections
    connectionManager.closeAllConnections();

    const transaction = this.db.transaction(this.STORE_NAMES, 'readwrite');
    const clearPromises = this.STORE_NAMES.map(storeName => this.clearStore(transaction, storeName));

    try {
      await Promise.all(clearPromises);
      await this.initManager.reinitialize();
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  private clearStore(transaction: IDBTransaction, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear ${storeName} store`));
    });
  }
}