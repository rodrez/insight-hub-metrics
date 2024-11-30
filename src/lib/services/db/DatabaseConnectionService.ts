import { DB_CONFIG } from './stores';
import { DatabaseError } from '../../utils/errorHandling';
import { connectionManager } from './connectionManager';
import { toast } from "@/components/ui/use-toast";
import { createStores } from './stores';

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  async init(): Promise<void> {
    if (this.initializationPromise) {
      console.log('Database initialization already in progress');
      return this.initializationPromise;
    }

    if (this.initialized && this.db) {
      console.log('Database already initialized');
      return;
    }

    let retryCount = 0;
    
    const initWithRetry = async (): Promise<void> => {
      try {
        await this.cleanupExistingConnections();
        this.db = await this.openConnection();
        this.initialized = true;
        connectionManager.addConnection(this.db);
        console.log('Database initialized successfully');
      } catch (error) {
        retryCount++;
        console.error(`Database initialization attempt ${retryCount} failed:`, error);
        
        if (retryCount < this.maxRetries) {
          console.log(`Retrying database initialization in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return initWithRetry();
        }
        
        this.initialized = false;
        this.db = null;
        throw new DatabaseError(
          `Failed to initialize database after ${this.maxRetries} attempts`,
          error instanceof Error ? error : undefined
        );
      }
    };

    this.initializationPromise = initWithRetry();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async cleanupExistingConnections(): Promise<void> {
    if (this.db) {
      console.log('Cleaning up existing database connection');
      try {
        connectionManager.removeConnection(this.db);
        this.db.close();
        this.db = null;
        this.initialized = false;
        
        // Give time for connections to properly close
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Error during connection cleanup:', error);
      }
    }
    connectionManager.closeAllConnections();
  }

  private openConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      console.log('Opening new database connection');
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        const error = request.error;
        console.error('Failed to open database:', error);
        reject(new DatabaseError('Failed to open database', error));
      };

      request.onblocked = (event) => {
        console.warn('Database opening blocked - closing other connections');
        connectionManager.closeAllConnections();
        reject(new DatabaseError('Database opening blocked'));
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed - creating stores');
        const db = (event.target as IDBOpenDBRequest).result;
        try {
          createStores(db);
          console.log('Stores created successfully');
        } catch (error) {
          console.error('Error creating stores:', error);
          reject(new DatabaseError('Failed to create database stores', error));
        }
      };

      request.onsuccess = () => {
        console.log('Database opened successfully');
        const db = request.result;
        
        db.onversionchange = () => {
          console.log('Database version change detected - closing connection');
          db.close();
          this.initialized = false;
          this.db = null;
          toast({
            title: "Database Update Required",
            description: "Please reload the application",
            variant: "destructive",
          });
        };
        
        db.onerror = (event) => {
          console.error('Database error:', event);
          toast({
            title: "Database Error",
            description: "An error occurred with the database connection",
            variant: "destructive",
          });
        };
        
        resolve(db);
      };
    });
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

  close(): void {
    if (this.db) {
      try {
        console.log('Closing database connection');
        connectionManager.removeConnection(this.db);
        this.db.close();
        this.db = null;
        this.initialized = false;
      } catch (error) {
        console.error('Error closing database:', error);
      }
    }
  }
}