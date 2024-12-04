import { toast } from "@/components/ui/use-toast";

type DBState = 'uninitialized' | 'initializing' | 'initialized' | 'error';
type QueuedOperation = () => Promise<void>;

export class DatabaseStateManager {
  private static instance: DatabaseStateManager | null = null;
  private state: DBState = 'uninitialized';
  private operationQueue: QueuedOperation[] = [];
  private initializationPromise: Promise<void> | null = null;
  private database: IDBDatabase | null = null;

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
    this.database = db;
    if (db) {
      this.state = 'initialized';
    }
  }

  async ensureInitialized(): Promise<void> {
    if (this.state === 'initialized') {
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
    
    this.initializationPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('projectManagementDB', 1);

        request.onerror = () => {
          this.state = 'error';
          console.error('Database initialization failed:', request.error);
          toast({
            title: "Database Error",
            description: "Failed to initialize database",
            variant: "destructive",
          });
          reject(request.error);
        };

        request.onsuccess = () => {
          this.database = request.result;
          this.state = 'initialized';
          console.log('Database initialized successfully');
          toast({
            title: "Success",
            description: "Database initialized successfully",
          });
          this.processQueuedOperations();
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('projects')) {
            db.createObjectStore('projects', { keyPath: 'id' });
          }
          // ... Add other stores as needed
        };
      } catch (error) {
        this.state = 'error';
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  async queueOperation(operation: QueuedOperation): Promise<void> {
    if (this.state === 'initialized') {
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