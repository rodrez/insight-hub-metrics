import { DatabaseError } from '../../utils/errorHandling';
import { TransactionLifecycleManager } from './transaction/TransactionLifecycleManager';
import { DB_CONFIG } from './stores';

export class DatabaseTransactionService {
  private transactionManager: TransactionLifecycleManager;

  constructor() {
    this.transactionManager = new TransactionLifecycleManager();
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    try {
      return await this.transactionManager.executeTransaction(
        DB_CONFIG.name,
        DB_CONFIG.version,
        storeName,
        mode,
        operation
      );
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new DatabaseError(
        `Transaction failed for store ${storeName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}