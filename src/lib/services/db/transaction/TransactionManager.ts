import { ConnectionPool } from '../connection/ConnectionPool';
import { DatabaseError } from '../../../utils/errorHandling';

export class TransactionManager {
  private connectionPool: ConnectionPool;
  private readonly TRANSACTION_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
    this.connectionPool = ConnectionPool.getInstance();
  }

  async performTransaction<T>(
    dbName: string,
    version: number,
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.MAX_RETRIES) {
      try {
        const connection = await this.connectionPool.acquireConnection(dbName, version);
        return await this.executeTransaction(connection, storeName, mode, operation);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;
        if (attempt < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    }

    throw new DatabaseError(`Transaction failed after ${this.MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  private executeTransaction<T>(
    connection: IDBDatabase,
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const transaction = connection.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      let isCompleted = false;

      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          transaction.abort();
          reject(new DatabaseError(`Transaction timeout after ${this.TRANSACTION_TIMEOUT}ms`));
        }
      }, this.TRANSACTION_TIMEOUT);

      const cleanup = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
      };

      transaction.oncomplete = () => {
        cleanup();
      };

      transaction.onerror = () => {
        cleanup();
        reject(new DatabaseError(transaction.error?.message || 'Transaction failed'));
      };

      transaction.onabort = () => {
        cleanup();
        reject(new DatabaseError('Transaction aborted'));
      };

      try {
        const request = operation(store);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(new DatabaseError(request.error?.message || 'Operation failed'));
        };
      } catch (error) {
        cleanup();
        reject(new DatabaseError(error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }
}