import { DB_CONFIG } from '../stores';
import { DatabaseError } from '../../../utils/errorHandling';
import { toast } from "@/components/ui/use-toast";
import { createStores } from '../stores';

export class DatabaseInitializer {
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  async initializeDatabase(): Promise<IDBDatabase> {
    console.log('Starting database initialization');
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        const error = request.error;
        console.error('Failed to open database:', error);
        reject(new DatabaseError('Failed to open database', error));
      };

      request.onblocked = () => {
        console.warn('Database opening blocked - closing other connections');
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
          console.log('Database version change detected');
          db.close();
          toast({
            title: "Database Update Required",
            description: "Please reload the application",
            variant: "destructive",
          });
        };
        
        resolve(db);
      };
    });
  }

  async initWithRetry(): Promise<IDBDatabase> {
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      try {
        console.log(`Database initialization attempt ${retryCount + 1}`);
        const db = await this.initializeDatabase();
        console.log('Database initialized successfully');
        return db;
      } catch (error) {
        retryCount++;
        console.error(`Database initialization attempt ${retryCount} failed:`, error);
        
        if (retryCount < this.maxRetries) {
          console.log(`Retrying database initialization in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        } else {
          throw new DatabaseError(
            `Failed to initialize database after ${this.maxRetries} attempts`,
            error instanceof Error ? error : undefined
          );
        }
      }
    }

    throw new DatabaseError('Database initialization failed');
  }
}