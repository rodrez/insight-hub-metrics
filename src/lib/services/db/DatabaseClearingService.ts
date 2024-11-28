import { toast } from "@/components/ui/use-toast";
import { connectionManager } from './connectionManager';
import { DatabaseCleaner } from './databaseCleaner';

export class DatabaseClearingService {
  private projectStore: any;
  private smeStore: any;
  private db: IDBDatabase | null;

  constructor(db: IDBDatabase | null, projectStore: any, smeStore: any) {
    this.db = db;
    this.projectStore = projectStore;
    this.smeStore = smeStore;
  }

  async clearDatabase(): Promise<void> {
    try {
      connectionManager.closeAllConnections();
      await DatabaseCleaner.clearDatabase();
      
      this.projectStore = null;
      this.smeStore = null;
      this.db = null;

      toast({
        title: "Database cleared",
        description: "All data has been successfully removed.",
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