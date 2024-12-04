import { toast } from "@/components/ui/use-toast";

export class DatabaseInitializer {
  private dbName: string;
  private version: number;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.version = version;
  }

  async initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      console.info('Starting database initialization');
      
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = (event) => {
        console.error('Failed to open database:', event);
        // Check if private browsing mode is enabled
        if (request.error?.name === 'SecurityError' || !window.indexedDB) {
          toast({
            title: "Database Error",
            description: "IndexedDB access is restricted. This may happen in private browsing mode.",
            variant: "destructive",
          });
        }
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.info('Database initialized successfully');
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  async initWithRetry(maxRetries: number = 3, delay: number = 1000): Promise<IDBDatabase> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.info(`Database initialization attempt ${attempt}`);
        const db = await this.initDatabase();
        return db;
      } catch (error) {
        console.error(`Database initialization attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.info(`Retrying database initialization in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Database initialization failed after all retries');
  }

  private createStores(db: IDBDatabase) {
    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains('projects')) {
      db.createObjectStore('projects', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('collaborators')) {
      db.createObjectStore('collaborators', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('smePartners')) {
      db.createObjectStore('smePartners', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('spis')) {
      db.createObjectStore('spis', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('sitreps')) {
      db.createObjectStore('sitreps', { keyPath: 'id' });
    }
  }
}