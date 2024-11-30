import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { DatabaseConnectionService } from '../DatabaseConnectionService';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  public async init(): Promise<void> {
    await this.connectionService.init();
    this.transactionService = new DatabaseTransactionService(this.connectionService.getDatabase());
  }

  public getDatabase(): IDBDatabase | null {
    return this.connectionService.getDatabase();
  }
}