import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '@/lib/utils/errorHandling';

export class DatabaseInitializer {
  private dbName: string;
  private version: number;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.version = version;
  }

  async initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // Check if IndexedDB is available
      if (!window.indexedDB) {
        const error = new DatabaseError('IndexedDB is not supported in this browser');
        console.error(error);
        toast({
          title: "Browser Compatibility Error",
          description: "Your browser doesn't support IndexedDB. Please use a modern browser.",
          variant: "destructive",
        });
        reject(error);
        return;
      }

      console.info('Starting database initialization');
      
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = (event) => {
        const error = request.error;
        console.error('Failed to open database:', error);
        
        // Check for specific error types
        if (error?.name === 'SecurityError') {
          toast({
            title: "Private Browsing Error",
            description: "IndexedDB access is restricted. This may happen in private browsing mode.",
            variant: "destructive",
          });
        } else if (error?.name === 'QuotaExceededError') {
          toast({
            title: "Storage Error",
            description: "Storage quota exceeded. Please free up some space.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Database Error",
            description: error?.message || "Failed to open database",
            variant: "destructive",
          });
        }
        
        reject(new DatabaseError(error?.message || 'Failed to open database'));
      };

      request.onblocked = () => {
        console.warn('Database blocked - other connections need to be closed');
        toast({
          title: "Database Blocked",
          description: "Please close other tabs using this application and try again.",
          variant: "destructive",
        });
        reject(new DatabaseError('Database blocked by other connections'));
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.info('Database initialized successfully');
        
        // Add error handler for the database connection
        db.onerror = (event) => {
          console.error('Database error:', event);
          toast({
            title: "Database Error",
            description: "An error occurred while accessing the database",
            variant: "destructive",
          });
        };
        
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.info('Database upgrade needed, creating stores...');
        this.createStores(db);
      };
    });
  }

  async initWithRetry(maxRetries: number = 3, delay: number = 1000): Promise<IDBDatabase> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.info(`Database initialization attempt ${attempt}`);
        const db = await this.initDatabase();
        return db;
      } catch (error) {
        lastError = error as Error;
        console.error(`Database initialization attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Don't retry certain errors
        if (error instanceof DatabaseError && 
            (error.message.includes('SecurityError') || 
             error.message.includes('not supported'))) {
          break;
        }
        
        console.info(`Retrying database initialization in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new DatabaseError('Database initialization failed after all retries');
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