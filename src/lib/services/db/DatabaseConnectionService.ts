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
  private cleanupTimeout: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL = 300000; // 5 minutes

  constructor() {
    // Set up periodic cleanup
    this.startCleanupInterval();
    // Ensure cleanup on window unload
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => this.cleanup());
    }
  }

  private startCleanupInterval() {
    if (this.cleanupTimeout) {
      clearInterval(this.cleanupTimeout);
    }
    this.cleanupTimeout = setInterval(() => {
      this.performPeriodicCleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private async performPeriodicCleanup() {
    console.log('Performing periodic connection cleanup');
    if (!this.initialized || !this.db) return;

    const isActive = await this.checkConnectionActivity();
    if (!isActive) {
      await this.cleanup();
    }
  }

  private async checkConnectionActivity(): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      // Try a simple transaction to check if connection is still active
      const transaction = this.db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      await new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(false);
      });
      return true;
    } catch (error) {
      console.warn('Connection check failed:', error);
      return false;
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
        await this.cleanup();
        // Give time for connections to properly close
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Error during connection cleanup:', error);
      }
    }
    connectionManager.closeAllConnections();
  }

  private async cleanup(): Promise<void> {
    if (this.cleanupTimeout) {
      clearInterval(this.cleanupTimeout);
      this.cleanupTimeout = null;
    }

    if (this.db) {
      try {
        console.log('Closing database connection');
        // Abort any pending transactions
        const stores = Array.from(this.db.objectStoreNames);
        stores.forEach(storeName => {
          try {
            const transaction = this.db!.transaction(storeName, 'readwrite');
            transaction.abort();
          } catch (error) {
            console.warn(`Error aborting transaction for store ${storeName}:`, error);
          }
        });

        connectionManager.removeConnection(this.db);
        this.db.close();
        this.db = null;
        this.initialized = false;
        console.log('Database connection closed successfully');
      } catch (error) {
        console.error('Error during database cleanup:', error);
        throw new DatabaseError('Failed to cleanup database connection', 
          error instanceof Error ? error : undefined);
      }
    }
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
          this.cleanup().catch(console.error);
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

  async close(): Promise<void> {
    await this.cleanup();
  }
}