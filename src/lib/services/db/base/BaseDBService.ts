import { DB_CONFIG, createStores } from '../stores';
import { DatabaseError } from '@/lib/utils/errorHandling';
import { toast } from "@/components/ui/use-toast";

export class BaseDBService {
  protected db: IDBDatabase | null = null;
  
  protected async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      try {
        console.log('Initializing database connection...');
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

        request.onerror = (event) => {
          const error = new DatabaseError('Failed to open database', request.error);
          console.error('Database initialization error:', error);
          toast({
            title: "Database Error",
            description: "Failed to initialize database connection. Please refresh the page.",
            variant: "destructive",
          });
          reject(error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          console.log('Database connection established successfully');
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
            toast({
              title: "Database Error",
              description: "Failed to create database stores. Please try again.",
              variant: "destructive",
            });
            reject(new DatabaseError('Failed to create database stores', error));
          }
        };

        request.onblocked = () => {
          console.warn('Database blocked - other connections need to be closed');
          toast({
            title: "Database Blocked",
            description: "Please close other tabs using this application and refresh.",
            variant: "destructive",
          });
          reject(new DatabaseError('Database blocked by other connections'));
        };
      } catch (error) {
        console.error('Unexpected error during database initialization:', error);
        toast({
          title: "Critical Error",
          description: "An unexpected error occurred. Please refresh the page.",
          variant: "destructive",
        });
        reject(new DatabaseError('Unexpected database initialization error', error));
      }
    });
  }
  
  protected async ensureInitialized(): Promise<void> {
    if (!this.db) {
      try {
        await this.init();
      } catch (error) {
        console.error('Failed to ensure database initialization:', error);
        toast({
          title: "Database Error",
          description: "Failed to connect to database. Please refresh the page.",
          variant: "destructive",
        });
        throw new DatabaseError('Database initialization failed', error);
      }
    }
    if (!this.db) {
      throw new DatabaseError('Database not initialized after initialization attempt');
    }
  }

  protected async getStore(storeName: string): Promise<IDBObjectStore> {
    try {
      await this.ensureInitialized();
      if (!this.db) {
        throw new DatabaseError('Database not initialized');
      }
      const transaction = this.db.transaction(storeName, 'readwrite');
      return transaction.objectStore(storeName);
    } catch (error) {
      console.error(`Failed to get store ${storeName}:`, error);
      toast({
        title: "Database Error",
        description: `Failed to access ${storeName} store. Please try again.`,
        variant: "destructive",
      });
      throw new DatabaseError(`Failed to get store: ${storeName}`, error);
    }
  }
  
  protected async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);

        transaction.onerror = () => {
          const error = transaction.error?.message || `Unknown transaction error on ${storeName}`;
          console.error(`Transaction error in ${storeName}:`, error);
          toast({
            title: "Transaction Error",
            description: `Failed to complete operation on ${storeName}. Please try again.`,
            variant: "destructive",
          });
          reject(new DatabaseError(error));
        };

        transaction.onabort = () => {
          console.warn(`Transaction aborted on ${storeName}`);
          toast({
            title: "Operation Cancelled",
            description: `Operation on ${storeName} was cancelled. Please try again.`,
            variant: "destructive",
          });
          reject(new DatabaseError(`Transaction aborted on ${storeName}`));
        };

        const request = operation(store);
        
        request.onsuccess = () => {
          console.log(`Operation completed successfully on ${storeName}`);
          resolve(request.result);
        };
        
        request.onerror = () => {
          const error = request.error?.message || `Unknown operation error on ${storeName}`;
          console.error(`Operation error in ${storeName}:`, error);
          toast({
            title: "Operation Error",
            description: `Failed to complete operation on ${storeName}. Please try again.`,
            variant: "destructive",
          });
          reject(new DatabaseError(error));
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Unexpected error in ${storeName} operation:`, error);
        toast({
          title: "Critical Error",
          description: `An unexpected error occurred. Please try again.`,
          variant: "destructive",
        });
        reject(new DatabaseError(errorMessage));
      }
    });
  }

  setDatabase(db: IDBDatabase) {
    this.db = db;
    console.log('Database reference updated successfully');
  }
}