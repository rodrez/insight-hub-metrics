export class TransactionManager {
  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
        console.error(`Transaction error on ${storeName}:`, error);
        reject(new Error(error));
      };

      transaction.oncomplete = () => {
        console.log(`Transaction completed successfully on ${storeName}`);
      };

      try {
        const request = operation(store);
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          console.error(`Operation error on ${storeName}:`, error);
          reject(new Error(error));
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error in ${storeName} operation:`, errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }

  async batchOperation<T>(
    items: T[],
    storeName: string,
    operation: (store: IDBObjectStore, item: T) => IDBRequest
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      transaction.onerror = () => {
        const error = transaction.error?.message || `Unknown batch operation error on ${storeName}`;
        console.error(`Batch operation failed on ${storeName}:`, error);
        reject(new Error(error));
      };

      transaction.oncomplete = () => {
        console.log(`Batch operation completed successfully on ${storeName}`);
        resolve();
      };

      items.forEach(item => {
        try {
          operation(store, item);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error processing item in ${storeName}:`, errorMessage);
          reject(new Error(errorMessage));
        }
      });
    });
  }
}