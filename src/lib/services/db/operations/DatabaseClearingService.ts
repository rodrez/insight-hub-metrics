import { toast } from "@/components/ui/use-toast";
import { ServiceInitializationManager } from "../initialization/ServiceInitializationManager";
import { DatabaseVersionManager } from "../versioning/DatabaseVersionManager";
import { connectionManager } from '../connectionManager';

export class DatabaseClearingService {
  private versionManager: DatabaseVersionManager;

  constructor(
    private db: IDBDatabase | null,
    private initManager: ServiceInitializationManager
  ) {
    this.versionManager = DatabaseVersionManager.getInstance();
  }

  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      console.log('Starting database clearing process...');
      
      // Close all active connections
      connectionManager.closeAllConnections();
      
      // Upgrade database to clear all stores and recreate them
      await this.versionManager.upgradeDatabase();
      
      // Reset initialization state
      this.initManager.resetService('IndexedDB');
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }
}