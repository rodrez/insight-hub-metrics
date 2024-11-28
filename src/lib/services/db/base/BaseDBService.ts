import { DB_CONFIG, createStores } from '../stores';
import { DatabaseError } from '@/lib/utils/errorHandling';

export class BaseDBService {
  protected db: IDBDatabase | null = null;
  
  protected async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        reject(new DatabaseError('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
      };
    });
  }
  
  protected async ensureInitialized(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }
  }

  protected async getStore(storeName: string): Promise<IDBObjectStore> {
    await this.ensureInitialized();
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }
    const transaction = this.db.transaction(storeName, 'readwrite');
    return transaction.objectStore(storeName);
  }
  
  protected async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
        reject(new DatabaseError(error));
      };

      try {
        const request = operation(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          reject(new DatabaseError(error));
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        reject(new DatabaseError(errorMessage));
      }
    });
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
  }
}