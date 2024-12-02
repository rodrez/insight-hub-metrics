import { DatabaseError } from '../../utils/errorHandling';
import { TransactionManager } from './transaction/TransactionManager';
import { DB_CONFIG } from './stores';

export class DatabaseTransactionService {
  private transactionManager: TransactionManager;

  constructor() {
    this.transactionManager = new TransactionManager();
  }

  async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    try {
      return await this.transactionManager.performTransaction(
        DB_CONFIG.name,
        DB_CONFIG.version,
        storeName,
        mode,
        operation
      );
    } catch (error) {
      throw new DatabaseError(
        `Transaction failed for store ${storeName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}