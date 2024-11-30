import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { DatabaseConnectionService } from '../DatabaseConnectionService';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  protected async init(): Promise<void> {
    await this.connectionService.init();
    this.transactionService = new DatabaseTransactionService(this.connectionService.getDatabase());
  }

  protected getDatabase(): IDBDatabase | null {
    return this.connectionService.getDatabase();
  }
}