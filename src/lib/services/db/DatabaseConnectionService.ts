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
      // Close any existing connections before attempting to open a new one
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
      console.error('Database initialization failed:', error);
      this.initialized = false;
      this.db = null;
      
      // Cleanup any existing connections
      connectionManager.closeAllConnections();
      
      throw new DatabaseError(
        'Failed to initialize database', 
        error instanceof Error ? error : new Error('Unknown error')
      );
    }
  }

  private openConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Opening IndexedDB: ${DB_CONFIG.name} v${DB_CONFIG.version}`);
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = () => {
          console.error('Failed to open database:', request.error);
          reject(new DatabaseError('Failed to open database', request.error));
        };

        request.onblocked = () => {
          console.warn('Database opening blocked - closing other connections');
          connectionManager.closeAllConnections();
          reject(new DatabaseError('Database opening blocked'));
        };

        request.onsuccess = () => {
          console.log('Database opened successfully');
          const db = request.result;
          
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
          console.log('Database upgrade needed');
          const db = (event.target as IDBOpenDBRequest).result;
          this.createStores(db);
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
      console.error('Error creating stores:', error);
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