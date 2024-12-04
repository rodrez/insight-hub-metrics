import { DatabaseError } from '../../utils/errorHandling';
import { TransactionQueueManager } from './TransactionQueueManager';
import { DatabaseEventEmitter } from './events/DatabaseEventEmitter';
import { toast } from "@/components/ui/use-toast";

export class DatabaseTransactionService {
  private db: IDBDatabase | null;
  private transactionQueue: TransactionQueueManager;
  private eventEmitter: DatabaseEventEmitter;
  private readonly TRANSACTION_TIMEOUT = 30000;
  private isReady: boolean = false;

  constructor(db: IDBDatabase | null) {
    this.db = db;
    this.transactionQueue = TransactionQueueManager.getInstance();
    this.eventEmitter = DatabaseEventEmitter.getInstance();
    
    // Listen for database events
    this.eventEmitter.on('ready', () => {
      console.log('Transaction service: Database ready');
      this.isReady = true;
      this.transactionQueue.setInitialized(true);
    });

    this.eventEmitter.on('error', () => {
      this.isReady = false;
      this.transactionQueue.clearQueue();
    });

    this.eventEmitter.on('cleanup', () => {
      this.isReady = false;
      this.transactionQueue.clearQueue();
    });
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.isReady) {
      console.log('Database not ready, queueing transaction');
      return new Promise<T>((resolve, reject) => {
        this.transactionQueue.enqueueTransaction(
          async () => {
            const result = await this.executeTransaction(storeName, mode, operation);
            resolve(result);
          }
        ).catch(reject);
      });
    }

    return this.executeTransaction(storeName, mode, operation);
  }

  private async executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.db) {
      console.error('Database not initialized in executeTransaction');
      throw new DatabaseError('Database not initialized');
    }

    return new Promise<T>((resolve, reject) => {
      console.log(`Starting transaction on store: ${storeName}`);
      let isCompleted = false;
      const timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error(`Transaction timeout for ${storeName}`);
          reject(new DatabaseError(`Transaction timeout for ${storeName}`));
        }
      }, this.TRANSACTION_TIMEOUT);

      try {
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

  setDatabase(db: IDBDatabase | null) {
    this.db = db;
    this.isReady = !!db;
    if (db) {
      this.eventEmitter.emit('ready');
    }
  }
}