export class TransactionManager {
  private db: IDBDatabase;
  private readonly TRANSACTION_TIMEOUT = 30000; // 30 seconds timeout
  private activeTransactions: Map<IDBTransaction, {
    timeoutId: NodeJS.Timeout,
    cleanup: () => void
  }> = new Map();

  constructor(db: IDBDatabase) {
    this.db = db;
    // Cleanup on window unload
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => this.cleanupAllTransactions());
    }
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      const timeoutId = setTimeout(() => {
        this.handleTransactionTimeout(transaction, storeName);
        reject(new Error(`Transaction timeout for ${storeName}`));
      }, this.TRANSACTION_TIMEOUT);

      const cleanup = () => {
        if (this.activeTransactions.has(transaction)) {
          const { timeoutId } = this.activeTransactions.get(transaction)!;
          clearTimeout(timeoutId);
          this.activeTransactions.delete(transaction);
        }

        transaction.removeEventListener('complete', onComplete);
        transaction.removeEventListener('error', onError);
        transaction.removeEventListener('abort', onAbort);
      };

      const onComplete = () => {
        cleanup();
        console.log(`Transaction completed successfully on ${storeName}`);
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

      // Store cleanup information
      this.activeTransactions.set(transaction, { timeoutId, cleanup });

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

  private handleTransactionTimeout(transaction: IDBTransaction, storeName: string) {
    console.error(`Transaction timeout for ${storeName}`);
    this.rollbackTransaction(transaction);
    if (this.activeTransactions.has(transaction)) {
      const { cleanup } = this.activeTransactions.get(transaction)!;
      cleanup();
    }
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
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      const timeoutId = setTimeout(() => {
        this.handleTransactionTimeout(transaction, storeName);
        reject(new Error(`Batch operation timeout for ${storeName}`));
      }, this.TRANSACTION_TIMEOUT);

      const cleanup = () => {
        if (this.activeTransactions.has(transaction)) {
          const { timeoutId } = this.activeTransactions.get(transaction)!;
          clearTimeout(timeoutId);
          this.activeTransactions.delete(transaction);
        }

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

      // Store cleanup information
      this.activeTransactions.set(transaction, { timeoutId, cleanup });

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

  public cleanupAllTransactions(): void {
    this.activeTransactions.forEach(({ timeoutId, cleanup }, transaction) => {
      clearTimeout(timeoutId);
      cleanup();
      if (transaction.mode === 'readwrite') {
        try {
          transaction.abort();
        } catch (error) {
          console.error('Error cleaning up transaction:', error);
        }
      }
    });
    this.activeTransactions.clear();
  }
}