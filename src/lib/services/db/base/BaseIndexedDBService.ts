import { DatabaseConnectionService } from '../DatabaseConnectionService';
import { DatabaseTransactionService } from '../DatabaseTransactionService';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  private database: IDBDatabase | null = null;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  public getDatabase(): IDBDatabase | null {
    return this.database;
  }

  protected async init(): Promise<void> {
    try {
      console.log('Initializing base IndexedDB service...');
      await this.connectionService.init();
      this.database = this.connectionService.getDatabase();
      console.log('Database connection established');
    } catch (error) {
      console.error('Error initializing base service:', error);
      throw error;
    }
  }

  protected async closeConnection(): Promise<void> {
    if (this.database) {
      console.log('Closing database connection...');
      this.database.close();
      this.database = null;
      console.log('Database connection closed');
    }
  }
}