import { toast } from "@/components/ui/use-toast";

type TransactionOperation = () => Promise<void>;

interface QueuedTransaction {
  operation: TransactionOperation;
  priority: number;
  timestamp: number;
  retryCount: number;
}

export class TransactionQueueManager {
  private static instance: TransactionQueueManager;
  private queue: QueuedTransaction[] = [];
  private isProcessing: boolean = false;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private constructor() {}

  public static getInstance(): TransactionQueueManager {
    if (!TransactionQueueManager.instance) {
      TransactionQueueManager.instance = new TransactionQueueManager();
    }
    return TransactionQueueManager.instance;
  }

  public async enqueueTransaction(
    operation: TransactionOperation,
    priority: number = 1
  ): Promise<void> {
    const transaction: QueuedTransaction = {
      operation,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(transaction);
    this.queue.sort((a, b) => b.priority - a.priority);

    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const transaction = this.queue[0];
        
        try {
          await this.executeTransaction(transaction);
          this.queue.shift(); // Remove successful transaction
        } catch (error) {
          await this.handleTransactionError(transaction);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeTransaction(transaction: QueuedTransaction): Promise<void> {
    try {
      await transaction.operation();
    } catch (error) {
      throw error;
    }
  }

  private async handleTransactionError(transaction: QueuedTransaction): Promise<void> {
    if (transaction.retryCount < this.MAX_RETRIES) {
      transaction.retryCount++;
      // Move to the end of the same priority level
      this.queue = this.queue.filter(t => t !== transaction);
      this.queue.push(transaction);
      
      toast({
        title: "Transaction Retry",
        description: `Retrying operation (attempt ${transaction.retryCount}/${this.MAX_RETRIES})`,
      });

      await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * transaction.retryCount));
    } else {
      toast({
        title: "Transaction Failed",
        description: "Operation failed after maximum retry attempts",
        variant: "destructive",
      });
      this.queue.shift(); // Remove failed transaction
    }
  }

  public clearQueue(): void {
    this.queue = [];
    this.isProcessing = false;
  }
}