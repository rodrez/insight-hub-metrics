export class TransactionManager {
  private db: IDBDatabase;
  private readonly TRANSACTION_TIMEOUT = 30000; // 30 seconds timeout
  private activeTransactions: Set<IDBTransaction> = new Set();

  constructor(db: IDBDatabase) {
    this.db = db;
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let isCompleted = false;
      const transaction = this.db.transaction(storeName, mode);
      this.activeTransactions.add(transaction);
      const store = transaction.objectStore(storeName);

      // Set transaction timeout with automatic rollback
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error(`Transaction timeout for ${storeName} after ${this.TRANSACTION_TIMEOUT}ms`);
          this.rollbackTransaction(transaction);
          reject(new Error(`Transaction timeout for ${storeName}`));
        }
      }, this.TRANSACTION_TIMEOUT);

      const cleanup = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        this.activeTransactions.delete(transaction);
        
        // Remove event listeners to prevent memory leaks
        transaction.removeEventListener('complete', onComplete);
        transaction.removeEventListener('error', onError);
        transaction.removeEventListener('abort', onAbort);
      };

      const onComplete = () => {
        cleanup();
        console.log(`Transaction completed successfully on ${storeName}`);
        resolve(transaction.objectStore(storeName).get(0));
      };

      const onError = () => {
        cleanup();
        const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
        console.error(`Transaction error on ${storeName}:`, error);
        this.rollbackTransaction(transaction);
        reject(new Error(error));
      };

      const onAbort = () => {
        cleanup();
        console.warn(`Transaction aborted on ${storeName}`);
        reject(new Error(`Transaction aborted on ${storeName}`));
      };

      // Add event listeners
      transaction.addEventListener('complete', onComplete);
      transaction.addEventListener('error', onError);
      transaction.addEventListener('abort', onAbort);

      try {
        const request = operation(store);
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          cleanup();
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          console.error(`Operation error on ${storeName}:`, error);
          this.rollbackTransaction(transaction);
          reject(new Error(error));
        };
      } catch (error) {
        cleanup();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error in ${storeName} operation:`, errorMessage);
        this.rollbackTransaction(transaction);
        reject(new Error(errorMessage));
      }
    });
  }

  private rollbackTransaction(transaction: IDBTransaction): void {
    try {
      if (transaction.mode === 'readwrite') {
        transaction.abort();
      }
    } catch (error) {
      console.error('Error during transaction rollback:', error);
    }
  }

  async batchOperation<T>(
    items: T[],
    storeName: string,
    operation: (store: IDBObjectStore, item: T) => IDBRequest
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let isCompleted = false;
      const transaction = this.db.transaction(storeName, 'readwrite');
      this.activeTransactions.add(transaction);
      const store = transaction.objectStore(storeName);

      // Set transaction timeout with automatic rollback
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error(`Batch operation timeout for ${storeName} after ${this.TRANSACTION_TIMEOUT}ms`);
          this.rollbackTransaction(transaction);
          reject(new Error(`Batch operation timeout for ${storeName}`));
        }
      }, this.TRANSACTION_TIMEOUT);

      const cleanup = () => {
        isCompleted = true;
        clearTimeout(timeoutId);
        this.activeTransactions.delete(transaction);
        
        // Remove event listeners
        transaction.removeEventListener('complete', onComplete);
        transaction.removeEventListener('error', onError);
        transaction.removeEventListener('abort', onAbort);
      };

      const onComplete = () => {
        cleanup();
        console.log(`Batch operation completed successfully on ${storeName}`);
        resolve();
      };

      const onError = () => {
        cleanup();
        const error = transaction.error?.message || `Unknown batch operation error on ${storeName}`;
        console.error(`Batch operation failed on ${storeName}:`, error);
        this.rollbackTransaction(transaction);
        reject(new Error(error));
      };

      const onAbort = () => {
        cleanup();
        console.warn(`Batch operation aborted on ${storeName}`);
        reject(new Error(`Batch operation aborted on ${storeName}`));
      };

      // Add event listeners
      transaction.addEventListener('complete', onComplete);
      transaction.addEventListener('error', onError);
      transaction.addEventListener('abort', onAbort);

      try {
        items.forEach(item => {
          operation(store, item);
        });
      } catch (error) {
        cleanup();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing batch in ${storeName}:`, errorMessage);
        this.rollbackTransaction(transaction);
        reject(new Error(errorMessage));
      }
    });
  }

  // Clean up any hanging transactions
  public cleanupHangingTransactions(): void {
    this.activeTransactions.forEach(transaction => {
      if (transaction.mode === 'readwrite') {
        try {
          transaction.abort();
        } catch (error) {
          console.error('Error cleaning up hanging transaction:', error);
        }
      }
      this.activeTransactions.delete(transaction);
    });
  }
}
