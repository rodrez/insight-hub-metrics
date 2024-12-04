import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '../../utils/errorHandling';

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
  private isInitialized: boolean = false;

  private constructor() {
    // Initialize event listeners for database state changes
    window.addEventListener('unload', () => this.clearQueue());
  }

  public static getInstance(): TransactionQueueManager {
    if (!TransactionQueueManager.instance) {
      TransactionQueueManager.instance = new TransactionQueueManager();
    }
    return TransactionQueueManager.instance;
  }

  public setInitialized(value: boolean) {
    this.isInitialized = value;
    if (value && !this.isProcessing) {
      this.processQueue();
    }
  }

  public async enqueueTransaction(
    operation: TransactionOperation,
    priority: number = 1
  ): Promise<void> {
    console.log('Enqueueing transaction with priority:', priority);
    
    const transaction: QueuedTransaction = {
      operation,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(transaction);
    this.queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);

    if (this.isInitialized && !this.isProcessing) {
      await this.processQueue();
    } else {
      console.log('Transaction queued - waiting for initialization or queue processing');
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0 || !this.isInitialized) {
      console.log('Queue processing skipped:', {
        isProcessing: this.isProcessing,
        queueLength: this.queue.length,
        isInitialized: this.isInitialized
      });
      return;
    }

    this.isProcessing = true;
    console.log('Starting queue processing');

    try {
      while (this.queue.length > 0 && this.isInitialized) {
        const transaction = this.queue[0];
        
        try {
          console.log('Executing transaction');
          await this.executeTransaction(transaction);
          this.queue.shift(); // Remove successful transaction
          console.log('Transaction completed successfully');
        } catch (error) {
          console.error('Transaction failed:', error);
          await this.handleTransactionError(transaction);
        }
      }
    } finally {
      this.isProcessing = false;
      console.log('Queue processing completed');
    }
  }

  private async executeTransaction(transaction: QueuedTransaction): Promise<void> {
    if (!this.isInitialized) {
      throw new DatabaseError('Database not initialized');
    }

    try {
      await transaction.operation();
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }

  private async handleTransactionError(transaction: QueuedTransaction): Promise<void> {
    if (transaction.retryCount < this.MAX_RETRIES) {
      transaction.retryCount++;
      // Move to the end of the same priority level
      this.queue = this.queue.filter(t => t !== transaction);
      this.queue.push(transaction);
      
      console.log(`Retrying transaction (attempt ${transaction.retryCount}/${this.MAX_RETRIES})`);
      toast({
        title: "Transaction Retry",
        description: `Retrying operation (attempt ${transaction.retryCount}/${this.MAX_RETRIES})`,
      });

      await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * transaction.retryCount));
    } else {
      console.error('Transaction failed after maximum retries');
      toast({
        title: "Transaction Failed",
        description: "Operation failed after maximum retry attempts",
        variant: "destructive",
      });
      this.queue.shift(); // Remove failed transaction
    }
  }

  public clearQueue(): void {
    console.log('Clearing transaction queue');
    this.queue = [];
    this.isProcessing = false;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public isQueueEmpty(): boolean {
    return this.queue.length === 0;
  }
}