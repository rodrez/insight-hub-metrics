import { DatabaseError } from '../../utils/errorHandling';
import { TransactionQueueManager } from './TransactionQueueManager';

export class DatabaseTransactionService {
  private db: IDBDatabase | null;
  private transactionQueue: TransactionQueueManager;
  private readonly TRANSACTION_TIMEOUT = 30000;

  constructor(db: IDBDatabase | null) {
    this.db = db;
    this.transactionQueue = TransactionQueueManager.getInstance();
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      let isCompleted = false;
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          reject(new DatabaseError(`Transaction timeout for ${storeName}`));
        }
      }, this.TRANSACTION_TIMEOUT);

      const transaction = this.db!.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.oncomplete = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
      };

      transaction.onerror = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        reject(new DatabaseError(transaction.error?.message || `Transaction error on ${storeName}`));
      };

      transaction.onabort = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        reject(new DatabaseError(`Transaction aborted on ${storeName}`));
      };

      try {
        const request = operation(store);
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          reject(new DatabaseError(request.error?.message || `Operation error on ${storeName}`));
        };
      } catch (error) {
        isCompleted = true;
        clearTimeout(timeoutId);
        reject(new DatabaseError(error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }

  async enqueueOperation<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>,
    priority: number = 1
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.transactionQueue.enqueueTransaction(
        async () => {
          try {
            const result = await this.performTransaction(storeName, mode, operation);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        priority
      );
    });
  }
}