import { DB_CONFIG } from './stores';
import { DatabaseError } from '../../utils/errorHandling';
import { connectionManager } from './connectionManager';
import { toast } from "@/components/ui/use-toast";

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized && this.db) {
      console.log('Database already initialized');
      return;
    }
    
    try {
      if (this.db) {
        console.log('Closing existing database connection');
        this.close();
      }

      console.log('Opening new database connection');
      this.db = await this.openConnection();
      this.initialized = true;
      connectionManager.addConnection(this.db);
      console.log('Database initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Database initialization failed:', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      this.initialized = false;
      this.db = null;
      
      connectionManager.closeAllConnections();
      
      throw new DatabaseError(
        `Failed to initialize database: ${errorMessage}`, 
        error instanceof Error ? error : new Error(errorMessage)
      );
    }
  }

  private openConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      try {
        const dbName = DB_CONFIG.name;
        const dbVersion = DB_CONFIG.version;
        console.log(`Opening IndexedDB: ${dbName} v${dbVersion}`);
        
        // Delete the existing database if it's corrupted
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onsuccess = () => {
          const request = indexedDB.open(dbName, dbVersion);

          request.onerror = (event) => {
            const error = (event.target as IDBOpenDBRequest).error;
            console.error('Failed to open database:', {
              error: error?.message,
              name: error?.name,
              code: error?.code
            });
            reject(new DatabaseError('Failed to open database', error));
          };

          request.onblocked = (event) => {
            console.warn('Database opening blocked - closing other connections');
            connectionManager.closeAllConnections();
            reject(new DatabaseError('Database opening blocked'));
          };

          request.onsuccess = () => {
            console.log('Database opened successfully');
            const db = request.result;
            
            db.onerror = (event) => {
              console.error('Database error:', {
                message: (event.target as IDBDatabase).onerror?.toString() || 'Unknown error'
              });
              toast({
                title: "Database Error",
                description: "An error occurred with the database connection",
                variant: "destructive",
              });
            };
            
            resolve(db);
          };

          request.onupgradeneeded = (event) => {
            console.log('Database upgrade needed');
            const db = (event.target as IDBOpenDBRequest).result;
            this.createStores(db);
          };
        };

        deleteRequest.onerror = () => {
          console.error('Failed to delete existing database');
          reject(new DatabaseError('Failed to delete existing database'));
        };
      } catch (error) {
        console.error('Error in openConnection:', error);
        reject(new DatabaseError('Failed to initiate database opening', error));
      }
    });
  }

  private createStores(db: IDBDatabase): void {
    try {
      Object.entries(DB_CONFIG.stores).forEach(([storeName]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`Creating store: ${storeName}`);
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating stores:', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new DatabaseError('Failed to create database stores', error);
    }
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