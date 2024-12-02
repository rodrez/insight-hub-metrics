import { DatabaseError } from '../../../utils/errorHandling';
import { ConnectionPoolManager } from '../connection/ConnectionPoolManager';

export class TransactionLifecycleManager {
  private readonly TRANSACTION_TIMEOUT = 10000; // 10 seconds
  private readonly connectionPool: ConnectionPoolManager;

  constructor() {
    this.connectionPool = ConnectionPoolManager.getInstance();
  }

  async executeTransaction<T>(
    dbName: string,
    version: number,
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    const connection = await this.connectionPool.acquireConnection(dbName, version);
    console.log(`Starting ${mode} transaction on store:`, storeName);

    return new Promise<T>((resolve, reject) => {
      let isCompleted = false;
      const transaction = connection.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error(`Transaction timeout after ${this.TRANSACTION_TIMEOUT}ms`);
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
        console.log('Transaction completed successfully');
      };

      transaction.onerror = () => {
        cleanup();
        const error = transaction.error?.message || 'Unknown transaction error';
        console.error('Transaction error:', error);
        reject(new DatabaseError(error));
      };

      transaction.onabort = () => {
        cleanup();
        console.warn('Transaction aborted');
        reject(new DatabaseError('Transaction aborted'));
      };

      try {
        const request = operation(store);
        
        request.onsuccess = () => {
          console.log('Operation completed successfully');
          resolve(request.result);
        };
        
        request.onerror = () => {
          const error = request.error?.message || 'Unknown operation error';
          console.error('Operation error:', error);
          reject(new DatabaseError(error));
        };
      } catch (error) {
        cleanup();
        console.error('Error executing operation:', error);
        reject(new DatabaseError(error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }
}