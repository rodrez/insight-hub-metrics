import { toast } from "@/components/ui/use-toast";
import { ServiceInitializationManager } from "../initialization/ServiceInitializationManager";
import { DatabaseStateMachine } from "../state/DatabaseStateMachine";

export class DatabaseClearingService {
  private stateMachine: DatabaseStateMachine;

  constructor(
    private db: IDBDatabase | null,
    private initManager: ServiceInitializationManager
  ) {
    this.stateMachine = DatabaseStateMachine.getInstance();
  }

  async clearDatabase(): Promise<void> {
    return this.stateMachine.queueOperation(async () => {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners', 'teams'];
      
      try {
        console.log('Starting database clearing process...');
        
        for (const storeName of stores) {
          console.log(`Clearing store: ${storeName}`);
          const transaction = this.db?.transaction(storeName, 'readwrite');
          if (transaction) {
            const objectStore = transaction.objectStore(storeName);
            await objectStore.clear();
          }
        }
        
        this.initManager.resetService('IndexedDB');
        
        toast({
          title: "Success",
          description: "Database cleared successfully",
        });
      } catch (error) {
        console.error('Error clearing database:', error);
        this.stateMachine.markAsError(error instanceof Error ? error : new Error(String(error)));
        toast({
          title: "Error",
          description: "Failed to clear database",
          variant: "destructive",
        });
        throw error;
      }
    });
  }
}