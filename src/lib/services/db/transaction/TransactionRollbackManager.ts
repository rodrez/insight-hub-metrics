import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

type RollbackOperation = () => Promise<void>;

export class TransactionRollbackManager {
  private static instance: TransactionRollbackManager | null = null;
  private rollbackStack: RollbackOperation[] = [];
  private isRollingBack = false;

  private constructor() {}

  static getInstance(): TransactionRollbackManager {
    if (!TransactionRollbackManager.instance) {
      TransactionRollbackManager.instance = new TransactionRollbackManager();
    }
    return TransactionRollbackManager.instance;
  }

  addRollbackOperation(operation: RollbackOperation) {
    if (!this.isRollingBack) {
      this.rollbackStack.push(operation);
    }
  }

  async executeWithRollback<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      // Clear rollback stack on success
      this.rollbackStack = [];
      return result;
    } catch (error) {
      console.error('Operation failed, initiating rollback:', error);
      await this.rollback();
      throw error;
    }
  }

  private async rollback() {
    if (this.isRollingBack) return;

    this.isRollingBack = true;
    console.log('Starting rollback process...');
    
    toast({
      title: "Rolling Back Changes",
      description: "An error occurred. Rolling back database changes...",
    });

    try {
      // Process rollback operations in reverse order (LIFO)
      while (this.rollbackStack.length > 0) {
        const operation = this.rollbackStack.pop();
        if (operation) {
          try {
            await operation();
          } catch (rollbackError) {
            console.error('Error during rollback operation:', rollbackError);
          }
        }
      }

      toast({
        title: "Rollback Complete",
        description: "All changes have been reversed successfully.",
      });
    } catch (error) {
      console.error('Critical error during rollback:', error);
      toast({
        title: "Rollback Failed",
        description: "Some changes could not be reversed. Database may be in an inconsistent state.",
        variant: "destructive",
      });
    } finally {
      this.isRollingBack = false;
      this.rollbackStack = [];
    }
  }
}