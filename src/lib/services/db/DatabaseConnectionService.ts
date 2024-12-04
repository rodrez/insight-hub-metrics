import { DatabaseError } from '../../utils/errorHandling';
import { connectionManager } from './connectionManager';
import { DatabaseInitializer } from './initialization/DatabaseInitializer';
import { DatabaseCleanup } from './cleanup/DatabaseCleanup';
import { DatabaseEventEmitter } from './events/DatabaseEventEmitter';
import { DatabaseStateMachine } from './state/DatabaseStateMachine';
import { toast } from "@/components/ui/use-toast";

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private initializationLock: boolean = false;
  private databaseInitializer: DatabaseInitializer;
  private databaseCleanup: DatabaseCleanup;
  private eventEmitter: DatabaseEventEmitter;
  private stateMachine: DatabaseStateMachine;

  constructor() {
    this.databaseInitializer = new DatabaseInitializer();
    this.databaseCleanup = new DatabaseCleanup(this.db);
    this.eventEmitter = DatabaseEventEmitter.getInstance();
    this.stateMachine = DatabaseStateMachine.getInstance();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => this.cleanup());
    }

    // Listen for state changes
    this.stateMachine.addStateListener((state) => {
      console.log('Database state changed:', state);
      if (state === 'ready') {
        this.initialized = true;
      } else if (state === 'error') {
        this.initialized = false;
      }
    });
  }

  async init(): Promise<void> {
    // If initialization is already in progress, return the existing promise
    if (this.initializationPromise) {
      console.log('Initialization already in progress, returning existing promise');
      return this.initializationPromise;
    }

    // If already initialized, return immediately
    if (this.initialized && this.db) {
      console.log('Database already initialized');
      return Promise.resolve();
    }

    // Create a new initialization promise
    this.initializationPromise = this.stateMachine.queueOperation(async () => {
      // Double-check initialization status after acquiring lock
      if (this.initialized && this.db) {
        console.log('Database initialized after lock acquisition');
        return;
      }

      try {
        console.log('Starting database initialization...');
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
      } finally {
        // Clear the initialization promise to allow future initialization attempts if needed
        this.initializationPromise = null;
      }
    });

    return this.initializationPromise;
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
    this.initializationPromise = null;
    this.stateMachine.reset();
  }

  getDatabase(): IDBDatabase | null {
    return this.db;
  }

  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  async close(): Promise<void> {
    await this.cleanup();
  }
}