import { DatabaseError } from '../../utils/errorHandling';

export class DatabaseTransactionService {
  constructor(private db: IDBDatabase | null) {}

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

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
}