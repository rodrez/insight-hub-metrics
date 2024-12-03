import { DatabaseConnectionService } from '../DatabaseConnectionService';
import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { toast } from "@/components/ui/use-toast";

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected database: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  public getDatabase(): IDBDatabase | null {
    return this.database;
  }

  public async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeDatabase();
    return this.initPromise;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      console.log('Initializing base IndexedDB service...');
      await this.connectionService.init();
      this.database = this.connectionService.getDatabase();
      
      if (!this.database) {
        throw new Error('Database initialization failed - database is null');
      }
      
      this.transactionService = new DatabaseTransactionService(this.database);
      console.log('Database connection established');
      
      toast({
        title: "Database Ready",
        description: "Database connection established and ready for use",
      });
    } catch (error) {
      console.error('Error initializing base service:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize database. Please refresh the page.",
        variant: "destructive",
      });
      this.initPromise = null;
      throw error;
    }
  }

  public setDatabase(db: IDBDatabase | null): void {
    this.database = db;
    this.transactionService = new DatabaseTransactionService(db);
  }
}