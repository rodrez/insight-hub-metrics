import { DB_CONFIG } from '../stores';
import { DatabaseError } from '../../utils/errorHandling';

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.db = await this.openConnection();
      this.initialized = true;
    } catch (error) {
      throw new DatabaseError('Failed to initialize database', error);
    }
  }

  private openConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => reject(new DatabaseError('Failed to open database'));
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  private createStores(db: IDBDatabase): void {
    Object.entries(DB_CONFIG.stores).forEach(([storeName]) => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    });
  }

  getDatabase(): IDBDatabase | null {
    return this.db;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}