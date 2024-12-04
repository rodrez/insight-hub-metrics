import { DatabaseInitializer } from './initialization/DatabaseInitializer';
import { toast } from "@/components/ui/use-toast";

export class DatabaseConnectionService {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.version = version;
  }

  async init(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.initializeDatabase();
    return this.connectionPromise;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const initializer = new DatabaseInitializer(this.dbName, this.version);
      this.db = await initializer.initWithRetry();
      
      // Add connection error handler
      this.db.onerror = (event) => {
        console.error('Database error:', event);
        toast({
          title: "Database Error",
          description: "An error occurred while accessing the database",
          variant: "destructive",
        });
      };

    } catch (error) {
      console.error('Database initialization failed:', error);
      this.connectionPromise = null;
      toast({
        title: "Database Error",
        description: "Failed to initialize the database. Please refresh the page.",
        variant: "destructive",
      });
      throw error;
    }
  }

  getDatabase(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.connectionPromise = null;
    }
  }
}