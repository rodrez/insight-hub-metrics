import { toast } from "@/components/ui/use-toast";
import { DB_CONFIG } from '../stores';
import { DatabaseError } from '../../../utils/errorHandling';
import { createStores } from '../stores';

export class DatabaseInitializer {
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  private async checkStorageQuota(): Promise<boolean> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        console.log('Storage quota details:', {
          usage: `${Math.round(estimate.usage! / 1024 / 1024)}MB`,
          quota: `${Math.round(estimate.quota! / 1024 / 1024)}MB`,
          percentageUsed: `${Math.round((estimate.usage! / estimate.quota!) * 100)}%`
        });
        return true;
      }
      console.warn('Storage estimation not supported');
      return true;
    } catch (error) {
      console.error('Error checking storage quota:', error);
      return false;
    }
  }

  private async cleanupExistingDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Attempting to delete existing database...');
      const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

      deleteRequest.onerror = () => {
        console.error('Error deleting existing database:', deleteRequest.error);
        reject(new Error('Failed to delete existing database'));
      };

      deleteRequest.onsuccess = () => {
        console.log('Successfully deleted existing database');
        resolve();
      };
    });
  }

  async initializeDatabase(): Promise<IDBDatabase> {
    console.log('Starting database initialization');
    
    const hasStorage = await this.checkStorageQuota();
    if (!hasStorage) {
      throw new DatabaseError('Insufficient storage quota');
    }

    return new Promise((resolve, reject) => {
      console.log('Opening database connection...');
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = (event) => {
        const error = request.error;
        console.error('Failed to open database:', {
          error,
          event,
          errorCode: request.error?.code,
          errorName: request.error?.name,
          errorMessage: request.error?.message
        });
        reject(new DatabaseError('Failed to open database', error));
      };

      request.onblocked = (event) => {
        console.warn('Database opening blocked - details:', {
          event,
          oldVersion: event.oldVersion,
          newVersion: event.newVersion
        });
        reject(new DatabaseError('Database opening blocked'));
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed - creating stores', {
          oldVersion: event.oldVersion,
          newVersion: event.newVersion
        });
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
          console.log('Database version change detected');
          db.close();
          toast({
            title: "Database Update Required",
            description: "Please reload the application",
            variant: "destructive",
          });
        };

        toast({
          title: "Database Initialized",
          description: "Database connection established successfully",
        });
        
        resolve(db);
      };
    });
  }

  async initWithRetry(): Promise<IDBDatabase> {
    let retryCount = 0;
    let lastError: Error | null = null;
    
    while (retryCount < this.maxRetries) {
      try {
        console.log(`Database initialization attempt ${retryCount + 1}`);
        
        if (retryCount > 0) {
          console.log('Attempting database cleanup before retry');
          await this.cleanupExistingDatabase();
        }
        
        const db = await this.initializeDatabase();
        console.log('Database initialized successfully');
        return db;
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Database initialization attempt ${retryCount} failed:`, {
          error,
          retryCount,
          maxRetries: this.maxRetries
        });
        
        if (retryCount < this.maxRetries) {
          console.log(`Retrying database initialization in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else {
          toast({
            title: "Database Error",
            description: `Failed to initialize database after ${this.maxRetries} attempts`,
            variant: "destructive",
          });
          throw new DatabaseError(
            `Failed to initialize database after ${this.maxRetries} attempts: ${lastError.message}`,
            lastError
          );
        }
      }
    }

    throw new DatabaseError('Database initialization failed');
  }
}