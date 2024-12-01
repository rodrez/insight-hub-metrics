import { DB_CONFIG, createStores } from '../stores';
import { DatabaseError } from '@/lib/utils/errorHandling';

export class BaseDBService {
  protected db: IDBDatabase | null = null;
  
  protected async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      try {
        console.log('Initializing database connection...');
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = () => {
          console.error('Failed to open database:', request.error);
          reject(new DatabaseError('Failed to open database'));
        };

        request.onsuccess = () => {
          console.log('Database opened successfully');
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          console.log('Database upgrade needed - creating stores');
          const db = (event.target as IDBOpenDBRequest).result;
          createStores(db);
        };
      } catch (error) {
        console.error('Error during database initialization:', error);
        reject(new DatabaseError('Database initialization failed'));
      }
    });
  }
  
  protected async ensureInitialized(): Promise<void> {
    if (!this.db) {
      console.log('Database not initialized, initializing...');
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
      if (!this.db) {
        reject(new DatabaseError('Database not initialized'));
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);

        transaction.onerror = () => {
          const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
          console.error(`Transaction error on ${storeName}:`, error);
          reject(new DatabaseError(error));
        };

        const request = operation(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          console.error(`Operation error on ${storeName}:`, error);
          reject(new DatabaseError(error));
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error in ${storeName} operation:`, errorMessage);
        reject(new DatabaseError(errorMessage));
      }
    });
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
  }
}