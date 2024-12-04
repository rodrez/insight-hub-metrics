import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

export class TransactionManager {
  private static rollbackActions: (() => Promise<void>)[] = [];

  static async executeInTransaction<T>(
    operation: () => Promise<T>,
    rollback: () => Promise<void>
  ): Promise<T> {
    try {
      const result = await operation();
      TransactionManager.rollbackActions = [];
      return result;
    } catch (error) {
      console.error('Transaction failed, initiating rollback:', error);
      await this.rollbackAll();
      throw error;
    }
  }

  static addRollbackAction(action: () => Promise<void>) {
    this.rollbackActions.push(action);
  }

  private static async rollbackAll() {
    console.log('Starting rollback process...');
    toast({
      title: "Rolling Back Changes",
      description: "An error occurred. Rolling back database changes...",
    });

    for (const action of [...this.rollbackActions].reverse()) {
      try {
        await action();
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
    }

    this.rollbackActions = [];
    
    toast({
      title: "Rollback Complete",
      description: "All changes have been reversed.",
    });
  }
}