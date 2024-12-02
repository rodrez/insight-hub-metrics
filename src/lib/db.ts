import { IndexedDBService } from './services/IndexedDBService';
import { DataService } from './services/DataService';

/**
 * Singleton class to manage the database service instance
 */
class DatabaseServiceManager {
  private static instance: DatabaseServiceManager | null = null;
  private dbService: DataService;

  private constructor() {
    // Initialize with IndexedDBService instance
    this.dbService = IndexedDBService.getInstance();
  }

  public static getInstance(): DatabaseServiceManager {
    if (!DatabaseServiceManager.instance) {
      DatabaseServiceManager.instance = new DatabaseServiceManager();
    }
    return DatabaseServiceManager.instance;
  }

  public getService(): DataService {
    return this.dbService;
  }

  // Method to reset the instance (useful for testing)
  public static resetInstance(): void {
    DatabaseServiceManager.instance = null;
  }
}

// Export a singleton instance of the database service
export const db: DataService = DatabaseServiceManager.getInstance().getService();

// Export the manager for cases where direct access to the manager is needed
export const databaseManager = DatabaseServiceManager;