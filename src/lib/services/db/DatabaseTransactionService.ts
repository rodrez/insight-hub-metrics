import { DatabaseError } from '../../utils/errorHandling';
import { TransactionQueueManager } from './TransactionQueueManager';

export class DatabaseTransactionService {
  private db: IDBDatabase | null;
  private transactionQueue: TransactionQueueManager;
  private readonly TRANSACTION_TIMEOUT = 30000;

  constructor(db: IDBDatabase | null) {
    this.db = db;
    this.transactionQueue = TransactionQueueManager.getInstance();
    this.transactionQueue.setInitialized(!!db);
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.db) {
      console.error('Database not initialized in performTransaction');
      throw new DatabaseError('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      console.log(`Starting transaction on store: ${storeName}`);
      let isCompleted = false;
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error(`Transaction timeout for ${storeName}`);
          reject(new DatabaseError(`Transaction timeout for ${storeName}`));
        }
      }, this.TRANSACTION_TIMEOUT);

      const transaction = this.db!.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.oncomplete = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        console.log(`Transaction completed on store: ${storeName}`);
      };

      transaction.onerror = (event) => {
        isCompleted = true;
        clearTimeout(timeoutId);
        console.error(`Transaction error on ${storeName}:`, transaction.error);
        reject(new DatabaseError(transaction.error?.message || `Transaction error on ${storeName}`));
      };

      transaction.onabort = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        console.error(`Transaction aborted on ${storeName}`);
        reject(new DatabaseError(`Transaction aborted on ${storeName}`));
      };

      try {
        console.log(`Executing operation on store: ${storeName}`);
        const request = operation(store);
        
        request.onsuccess = () => {
          console.log(`Operation successful on store: ${storeName}`);
          resolve(request.result);
        };
        
        request.onerror = () => {
          console.error(`Operation error on ${storeName}:`, request.error);
          reject(new DatabaseError(request.error?.message || `Operation error on ${storeName}`));
        };
      } catch (error) {
        isCompleted = true;
        clearTimeout(timeoutId);
        console.error(`Unexpected error in transaction on ${storeName}:`, error);
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
    console.log(`Enqueueing operation for store: ${storeName}`);
    return new Promise((resolve, reject) => {
      this.transactionQueue.enqueueTransaction(
        async () => {
          try {
            const result = await this.performTransaction(storeName, mode, operation);
            resolve(result);
          } catch (error) {
            console.error(`Error in queued operation for ${storeName}:`, error);
            reject(error);
          }
        },
        priority
      );
    });
  }

  setDatabase(db: IDBDatabase | null) {
    console.log('Setting database in DatabaseTransactionService');
    this.db = db;
    this.transactionQueue.setInitialized(!!db);
  }
}