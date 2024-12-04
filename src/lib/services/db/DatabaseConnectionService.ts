import { DatabaseError } from '../../utils/errorHandling';
import { connectionManager } from './connectionManager';
import { DatabaseInitializer } from './initialization/DatabaseInitializer';
import { DatabaseCleanup } from './cleanup/DatabaseCleanup';
import { DatabaseEventEmitter } from './events/DatabaseEventEmitter';
import { toast } from "@/components/ui/use-toast";

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private databaseInitializer: DatabaseInitializer;
  private databaseCleanup: DatabaseCleanup;
  private eventEmitter: DatabaseEventEmitter;

  constructor() {
    this.databaseInitializer = new DatabaseInitializer();
    this.databaseCleanup = new DatabaseCleanup(this.db);
    this.eventEmitter = DatabaseEventEmitter.getInstance();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => this.cleanup());
    }

    // Listen for initialization events
    this.eventEmitter.on('ready', () => {
      console.log('Database is ready');
      toast({
        title: "Database Ready",
        description: "Database connection established successfully",
      });
    });

    this.eventEmitter.on('error', (error) => {
      console.error('Database error:', error);
      toast({
        title: "Database Error",
        description: error?.message || "An error occurred with the database",
        variant: "destructive",
      });
    });
  }

  async init(): Promise<void> {
    if (this.initializationPromise) {
      console.log('Database initialization already in progress');
      return this.initializationPromise;
    }

    if (this.initialized && this.db) {
      console.log('Database already initialized');
      return;
    }

    this.eventEmitter.emit('initializing');
    this.initializationPromise = this.initializeDatabase();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.cleanupExistingConnections();
      this.db = await this.databaseInitializer.initWithRetry();
      this.initialized = true;
      connectionManager.addConnection(this.db);
      this.databaseCleanup = new DatabaseCleanup(this.db);
      this.databaseCleanup.startCleanupInterval();
      this.eventEmitter.emit('ready');
      console.log('Database initialization completed successfully');
    } catch (error) {
      this.initialized = false;
      this.db = null;
      this.eventEmitter.emit('error', error);
      throw error;
    }
  }

  private async cleanupExistingConnections(): Promise<void> {
    if (this.db) {
      console.log('Cleaning up existing database connection');
      try {
        await this.cleanup();
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Error during connection cleanup:', error);
      }
    }
    connectionManager.closeAllConnections();
  }

  async cleanup(): Promise<void> {
    this.eventEmitter.emit('cleanup');
    await this.databaseCleanup.cleanup();
    this.db = null;
    this.initialized = false;
  }

  getDatabase(): IDBDatabase | null {
    if (!this.initialized || !this.db) {
      console.warn('Attempting to get database before initialization');
    }
    return this.db;
  }

  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  async close(): Promise<void> {
    await this.cleanup();
  }
}