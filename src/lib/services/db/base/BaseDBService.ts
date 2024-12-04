import { DB_CONFIG, createStores } from '../stores';
import { DatabaseError } from '@/lib/utils/errorHandling';
import { toast } from "@/components/ui/use-toast";

export class BaseDBService {
  protected db: IDBDatabase | null = null;
  
  protected async init(): Promise<void> {
    if (this.db) {
      console.log('Database already initialized');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Opening database connection...');
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = () => {
          const error = new DatabaseError('Failed to open database', request.error);
          console.error('Database initialization error:', error);
          reject(error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.log('Database connection established successfully');
          
          // Set up error handling for the database
          this.db.onerror = (event) => {
            console.error('Database error:', event);
            toast({
              title: "Database Error",
              description: "An error occurred while accessing the database",
              variant: "destructive",
            });
          };
          
          resolve();
        };

        request.onupgradeneeded = (event) => {
          console.log('Database upgrade needed, creating stores...');
          const db = (event.target as IDBOpenDBRequest).result;
          try {
            createStores(db);
            console.log('Database stores created successfully');
          } catch (error) {
            console.error('Error creating database stores:', error);
            reject(new DatabaseError('Failed to create database stores', error));
          }
        };

        request.onblocked = () => {
          console.warn('Database blocked - other connections need to be closed');
          reject(new DatabaseError('Database blocked by other connections'));
        };
      } catch (error) {
        console.error('Unexpected error during database initialization:', error);
        reject(new DatabaseError('Unexpected database initialization error', error));
      }
    });
  }
  
  protected async ensureInitialized(): Promise<void> {
    if (!this.db) {
      console.log('Database not initialized, initializing now...');
      await this.init();
    }
    if (!this.db) {
      throw new DatabaseError('Database not initialized after initialization attempt');
    }
  }

  protected async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new DatabaseError('Database not initialized'));
        return;
      }

      try {
        console.log(`Starting ${mode} transaction on ${storeName}`);
        
        // Check if store exists
        if (!this.db.objectStoreNames.contains(storeName)) {
          console.error(`Store ${storeName} does not exist`);
          reject(new DatabaseError(`Store ${storeName} does not exist`));
          return;
        }

        const transaction = this.db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);

        transaction.onerror = (event) => {
          const error = transaction.error?.message || `Transaction error on ${storeName}`;
          console.error(`Transaction error in ${storeName}:`, error, event);
          reject(new DatabaseError(error));
        };

        transaction.onabort = (event) => {
          console.warn(`Transaction aborted on ${storeName}`, event);
          reject(new DatabaseError(`Transaction aborted on ${storeName}`));
        };

        const request = operation(store);
        
        request.onsuccess = () => {
          console.log(`Operation completed successfully on ${storeName}`);
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          const error = request.error?.message || `Operation error on ${storeName}`;
          console.error(`Operation error in ${storeName}:`, error, event);
          reject(new DatabaseError(error));
        };

        // Add transaction complete handler
        transaction.oncomplete = () => {
          console.log(`Transaction completed on ${storeName}`);
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Unexpected error in ${storeName} operation:`, error);
        reject(new DatabaseError(errorMessage));
      }
    });
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
    console.log('Database reference updated successfully');
  }
}