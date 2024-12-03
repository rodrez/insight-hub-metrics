import { DatabaseError } from '../../utils/errorHandling';
import { connectionManager } from './connectionManager';
import { DatabaseInitializer } from './initialization/DatabaseInitializer';
import { DatabaseCleanup } from './cleanup/DatabaseCleanup';

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private databaseInitializer: DatabaseInitializer;
  private databaseCleanup: DatabaseCleanup;

  constructor() {
    this.databaseInitializer = new DatabaseInitializer();
    this.databaseCleanup = new DatabaseCleanup(this.db);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => this.cleanup());
    }
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
      console.log('Database initialization completed successfully');
    } catch (error) {
      this.initialized = false;
      this.db = null;
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