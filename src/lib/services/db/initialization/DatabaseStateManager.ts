import { toast } from "@/components/ui/use-toast";
import { DB_CONFIG } from '../stores';

type DBState = 'uninitialized' | 'initializing' | 'initialized' | 'error';
type QueuedOperation = () => Promise<void>;

export class DatabaseStateManager {
  private static instance: DatabaseStateManager | null = null;
  private state: DBState = 'uninitialized';
  private operationQueue: QueuedOperation[] = [];
  private initializationPromise: Promise<void> | null = null;
  private database: IDBDatabase | null = null;
  private initializationAttempts: number = 0;
  private readonly MAX_INITIALIZATION_ATTEMPTS = 3;

  private constructor() {}

  static getInstance(): DatabaseStateManager {
    if (!DatabaseStateManager.instance) {
      DatabaseStateManager.instance = new DatabaseStateManager();
    }
    return DatabaseStateManager.instance;
  }

  getDatabase(): IDBDatabase | null {
    return this.database;
  }

  setDatabase(db: IDBDatabase | null) {
    if (this.database && this.database !== db) {
      try {
        console.log('Closing old database connection');
        this.database.close();
      } catch (error) {
        console.warn('Error closing old database connection:', error);
      }
    }
    
    this.database = db;
    if (db) {
      this.state = 'initialized';
      console.log('Database state updated: initialized');
      this.initializationAttempts = 0;
    } else {
      this.state = 'uninitialized';
      console.log('Database state updated: uninitialized');
    }
  }

  async ensureInitialized(): Promise<void> {
    if (this.state === 'initialized' && this.database) {
      return;
    }

    if (this.state === 'initializing') {
      return this.initializationPromise;
    }

    return this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.state = 'initializing';
    this.initializationAttempts++;
    
    console.log(`Attempting database initialization (attempt ${this.initializationAttempts}/${this.MAX_INITIALIZATION_ATTEMPTS})`);
    
    this.initializationPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = () => {
          console.error('Database initialization error:', request.error);
          this.state = 'error';
          
          if (this.initializationAttempts < this.MAX_INITIALIZATION_ATTEMPTS) {
            console.log('Will retry initialization');
            this.initializationPromise = null;
            setTimeout(() => {
              this.initializeDatabase().then(resolve).catch(reject);
            }, 1000);
          } else {
            toast({
              title: "Database Error",
              description: "Failed to initialize database after multiple attempts",
              variant: "destructive",
            });
            reject(request.error);
          }
        };

        request.onblocked = () => {
          console.warn('Database initialization blocked - attempting to close connections');
          if (this.database) {
            this.database.close();
          }
          reject(new Error('Database initialization blocked'));
        };

        request.onupgradeneeded = (event) => {
          console.log('Database upgrade needed - creating stores');
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Remove existing stores if they exist
          Array.from(db.objectStoreNames).forEach(storeName => {
            db.deleteObjectStore(storeName);
          });
          
          // Create fresh stores
          if (!db.objectStoreNames.contains('collaborators')) {
            const collaboratorsStore = db.createObjectStore('collaborators', { keyPath: 'id' });
            collaboratorsStore.createIndex('type', 'type', { unique: false });
            collaboratorsStore.createIndex('department', 'department', { unique: false });
          }

          ['projects', 'sitreps', 'spis', 'objectives', 'smePartners'].forEach(storeName => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        };

        request.onsuccess = () => {
          const db = request.result;
          
          db.onversionchange = () => {
            console.log('Database version change detected');
            db.close();
            this.database = null;
            this.state = 'uninitialized';
            toast({
              title: "Database Update",
              description: "Database version changed. Please refresh the page.",
            });
          };

          this.database = db;
          this.state = 'initialized';
          console.log('Database initialized successfully');
          
          this.processQueuedOperations();
          resolve();
        };
      } catch (error) {
        console.error('Unexpected error during database initialization:', error);
        this.state = 'error';
        reject(error);
      }
    }).finally(() => {
      this.initializationPromise = null;
    });

    return this.initializationPromise;
  }

  async queueOperation(operation: QueuedOperation): Promise<void> {
    if (this.state === 'initialized' && this.database) {
      return operation();
    }

    return new Promise((resolve, reject) => {
      this.operationQueue.push(async () => {
        try {
          await operation();
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      if (this.state === 'uninitialized') {
        this.ensureInitialized();
      }
    });
  }

  private async processQueuedOperations(): Promise<void> {
    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Error processing queued operation:', error);
        }
      }
    }
  }
}