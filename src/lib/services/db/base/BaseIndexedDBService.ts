import { DatabaseConnectionService } from '../DatabaseConnectionService';
import { DatabaseTransactionService } from '../DatabaseTransactionService';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected database: IDBDatabase | null = null;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  public getDatabase(): IDBDatabase | null {
    return this.database;
  }

  public async init(): Promise<void> {
    try {
      console.log('Initializing base IndexedDB service...');
      await this.connectionService.init();
      this.database = this.connectionService.getDatabase();
      this.transactionService = new DatabaseTransactionService(this.database);
      console.log('Database connection established');
    } catch (error) {
      console.error('Error initializing base service:', error);
      throw error;
    }
  }

  public setDatabase(db: IDBDatabase | null): void {
    this.database = db;
    this.transactionService = new DatabaseTransactionService(db);
  }
}