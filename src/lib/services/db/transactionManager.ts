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
        console.error(`Transaction error on ${storeName}:`, transaction.error);
        reject(transaction.error);
      };

      transaction.oncomplete = () => {
        console.log(`Transaction completed successfully on ${storeName}`);
      };

      try {
        const request = operation(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error(`Operation error on ${storeName}:`, request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error(`Error in ${storeName} operation:`, error);
        reject(error);
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
        console.error(`Batch operation failed on ${storeName}:`, transaction.error);
        reject(transaction.error);
      };

      transaction.oncomplete = () => {
        console.log(`Batch operation completed successfully on ${storeName}`);
        resolve();
      };

      items.forEach(item => {
        try {
          operation(store, item);
        } catch (error) {
          console.error(`Error processing item in ${storeName}:`, error);
          reject(error);
        }
      });
    });
  }
}