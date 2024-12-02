import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { SMEOperations } from './SMEOperations';
import { toast } from "@/components/ui/use-toast";
import { withRetry } from '@/lib/utils/retryUtils';

export class DatabaseOperations {
  private smeOperations: SMEOperations;

  constructor(private transactionService: DatabaseTransactionService) {
    this.smeOperations = new SMEOperations(transactionService);
  }

  async clearAllData(): Promise<void> {
    const stores = ['projects', 'collaborators', 'sitreps', 'spis', 'objectives', 'smePartners'];
    
    try {
      for (const storeName of stores) {
        await withRetry(
          async () => this.transactionService.performTransaction(storeName, 'readwrite', store => store.clear()),
          {
            operation: `Clearing store ${storeName}`,
            maxAttempts: 3,
            delayMs: 1000,
            backoffFactor: 1.5
          }
        );
      }
      
      console.log('All stores cleared successfully');
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing stores:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
      throw error;
    }
  }

  getSMEOperations(): SMEOperations {
    return this.smeOperations;
  }
}