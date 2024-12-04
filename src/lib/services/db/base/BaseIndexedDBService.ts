import { DatabaseConnectionService } from '../DatabaseConnectionService';
import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { toast } from "@/components/ui/use-toast";
import { withRetry } from '@/lib/utils/retryUtils';
import { DatabaseError } from '@/lib/utils/errorHandling';
import { DatabaseStateMachine } from '../state/DatabaseStateMachine';
import { DatabaseEventEmitter } from '../events/DatabaseEventEmitter';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected database: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private stateMachine: DatabaseStateMachine;
  private eventEmitter: DatabaseEventEmitter;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
    this.stateMachine = DatabaseStateMachine.getInstance();
    this.eventEmitter = DatabaseEventEmitter.getInstance();

    // Listen for database events
    this.eventEmitter.on('ready', () => {
      console.log('Base service: Database is ready');
    });

    this.eventEmitter.on('error', (error) => {
      console.error('Base service: Database error:', error);
    });
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
      this.eventEmitter.emit('initializing');
      await this.stateMachine.initialize();
      await withRetry(
        async () => {
          console.log('Initializing base IndexedDB service...');
          await this.connectionService.init();
          this.database = this.connectionService.getDatabase();
          
          if (!this.database) {
            throw new DatabaseError('Database initialization failed - database is null');
          }
          
          this.transactionService = new DatabaseTransactionService(this.database);
          console.log('Database connection established');
          this.eventEmitter.emit('ready');
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          onRetry: (attempt, error) => {
            console.warn(`Retry attempt ${attempt} for database initialization:`, error);
            toast({
              title: "Database Connection Retry",
              description: `Retrying connection (attempt ${attempt}/3)...`,
            });
          }
        }
      );
    } catch (error) {
      console.error('Error initializing base service:', error);
      this.stateMachine.markAsError(error instanceof Error ? error : new Error(String(error)));
      this.eventEmitter.emit('error', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize database after multiple retries. Please refresh the page.",
        variant: "destructive",
      });
      this.initPromise = null;
      throw error;
    }
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    return this.stateMachine.queueOperation(() =>
      withRetry(
        operation,
        {
          maxRetries: 3,
          initialDelay: 1000,
          onRetry: (attempt, error) => {
            console.warn(`Retry attempt ${attempt} for ${operationName}:`, error);
            toast({
              title: "Operation Retry",
              description: `Retrying ${operationName} (attempt ${attempt}/3)...`,
            });
          }
        }
      )
    );
  }

  public setDatabase(db: IDBDatabase | null): void {
    this.database = db;
    this.transactionService = new DatabaseTransactionService(db);
    if (db) {
      this.eventEmitter.emit('ready');
    }
  }
}