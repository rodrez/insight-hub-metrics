import { DB_CONFIG, createStores } from './stores';
import { DatabaseError } from '../../utils/errorHandling';

export class DatabaseConnectionService {
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized && this.db) {
      console.log('Database already initialized');
      return;
    }
    
    try {
      console.log('Opening database connection...');
      this.db = await this.openConnection();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new DatabaseError('Failed to initialize database', error);
    }
  }

  private openConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      console.log(`Opening database: ${DB_CONFIG.name} v${DB_CONFIG.version}`);
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        console.error('Database open error:', request.error);
        reject(new DatabaseError('Failed to open database'));
      };

      request.onsuccess = () => {
        console.log('Database opened successfully');
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        console.log('Database upgrade needed, creating stores...');
        const db = (event.target as IDBOpenDBRequest).result;
        createStores(db);
        console.log('Store creation completed');
      };
    });
  }

  getDatabase(): IDBDatabase | null {
    return this.db;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
      console.log('Database connection closed');
    }
  }
}