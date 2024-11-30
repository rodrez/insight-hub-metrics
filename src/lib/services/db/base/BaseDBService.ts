import { DB_CONFIG, createStores } from '../stores';
import { DatabaseError } from '@/lib/utils/errorHandling';

export class BaseDBService {
  protected db: IDBDatabase | null = null;
  
  protected async init(): Promise<void> {
    if (this.db) {
      console.log('Database already initialized');
      return;
    }

    console.log('Initializing database...');
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = (event) => {
        console.error('Database initialization error:', event);
        reject(new DatabaseError('Failed to open database'));
      };

      request.onsuccess = () => {
        console.log('Database opened successfully');
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed, creating stores...');
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
        console.log('Stores created successfully');
      };
    });
  }
  
  protected async ensureInitialized(): Promise<void> {
    console.log('Ensuring database is initialized...');
    if (!this.db) {
      console.log('Database not initialized, initializing...');
      await this.init();
    }
    if (!this.db) {
      console.error('Database initialization failed');
      throw new DatabaseError('Database not initialized');
    }
    console.log('Database initialization confirmed');
  }

  protected async getStore(storeName: string): Promise<IDBObjectStore> {
    console.log(`Getting store: ${storeName}`);
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
    console.log(`Performing ${mode} transaction on ${storeName}`);
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('Database not available for transaction');
        reject(new DatabaseError('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.onerror = (event) => {
        console.error(`Transaction error on ${storeName}:`, event);
        const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
        reject(new DatabaseError(error));
      };

      try {
        console.log(`Executing operation on ${storeName}`);
        const request = operation(store);
        
        request.onsuccess = () => {
          console.log(`Operation on ${storeName} completed successfully`);
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error(`Operation error on ${storeName}:`, event);
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          reject(new DatabaseError(error));
        };
      } catch (error) {
        console.error(`Error in ${storeName} operation:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        reject(new DatabaseError(errorMessage));
      }
    });
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
  }
}