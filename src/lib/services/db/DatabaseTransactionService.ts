import { DatabaseError } from '../../utils/errorHandling';

export class DatabaseTransactionService {
  constructor(private db: IDBDatabase | null) {}

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

    // Add retry logic for connection issues
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await new Promise<T>((resolve, reject) => {
          if (!this.db) {
            reject(new DatabaseError('Database connection lost'));
            return;
          }

          const transaction = this.db.transaction(storeName, mode);
          const store = transaction.objectStore(storeName);

          // Set up transaction error handling
          transaction.onerror = () => {
            const error = transaction.error?.message || `Transaction error on ${storeName}`;
            reject(new DatabaseError(error));
          };

          transaction.onabort = () => {
            reject(new DatabaseError(`Transaction aborted on ${storeName}`));
          };

          try {
            const request = operation(store);
            
            request.onsuccess = () => {
              resolve(request.result);
            };
            
            request.onerror = () => {
              const error = request.error?.message || `Operation error on ${storeName}`;
              reject(new DatabaseError(error));
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            reject(new DatabaseError(errorMessage));
          }
        });
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }

    throw new DatabaseError('Max retries exceeded');
  }

  setDatabase(db: IDBDatabase | null) {
    this.db = db;
  }
}