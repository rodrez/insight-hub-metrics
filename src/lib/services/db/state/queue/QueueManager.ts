import { toast } from "@/components/ui/use-toast";

interface QueuedOperation {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
  timestamp: number;
  priority: number;
}

export class QueueManager {
  private operationQueue: QueuedOperation[] = [];
  private isProcessing = false;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor() {
    console.log('Initializing QueueManager');
  }

  public enqueue(operation: QueuedOperation): void {
    console.log('Enqueueing new operation');
    this.operationQueue.push(operation);
    this.sortQueue();
  }

  public clear(): void {
    console.log('Clearing operation queue');
    this.operationQueue = [];
    this.isProcessing = false;
  }

  private sortQueue(): void {
    this.operationQueue.sort((a, b) => 
      b.priority - a.priority || a.timestamp - b.timestamp
    );
    console.log(`Queue sorted, current length: ${this.operationQueue.length}`);
  }

  public async processQueue(isReady: boolean): Promise<void> {
    if (this.isProcessing || this.operationQueue.length === 0 || !isReady) {
      console.log('Skipping queue processing:', {
        isProcessing: this.isProcessing,
        queueLength: this.operationQueue.length,
        isReady
      });
      return;
    }

    this.isProcessing = true;
    console.log(`Starting to process queue (${this.operationQueue.length} operations)`);
    
    while (this.operationQueue.length > 0 && isReady) {
      const operation = this.operationQueue.shift();
      if (!operation) continue;

      try {
        console.log(`Executing queued operation (attempt ${operation.retryCount + 1})`);
        const result = await operation.operation();
        operation.resolve(result);
        console.log('Operation completed successfully');
      } catch (error) {
        console.error('Operation failed:', error);
        
        if (operation.retryCount < this.MAX_RETRIES) {
          operation.retryCount++;
          console.log(`Retrying operation (attempt ${operation.retryCount}/${this.MAX_RETRIES})`);
          operation.timestamp = Date.now();
          this.operationQueue.unshift(operation);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * operation.retryCount));
          toast({
            title: "Retrying Operation",
            description: `Attempt ${operation.retryCount} of ${this.MAX_RETRIES}`,
          });
        } else {
          console.error('Operation failed after maximum retries');
          operation.reject(error);
          toast({
            title: "Operation Failed",
            description: "The operation failed after multiple retry attempts",
            variant: "destructive",
          });
        }
      }
    }

    this.isProcessing = false;
    console.log('Queue processing completed');
  }
}