import { toast } from "@/components/ui/use-toast";

export type DatabaseState = 'uninitialized' | 'initializing' | 'ready' | 'error';

interface QueuedOperation {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
  timestamp: number;
  priority: number;
}

export class DatabaseStateMachine {
  private static instance: DatabaseStateMachine;
  private currentState: DatabaseState = 'uninitialized';
  private operationQueue: QueuedOperation[] = [];
  private stateListeners: ((state: DatabaseState) => void)[] = [];
  private initializationPromise: Promise<void> | null = null;
  private initializeResolve: (() => void) | null = null;
  private initializeReject: ((error: Error) => void) | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;
  private isProcessingQueue = false;

  private constructor() {
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
    
    // Add logging for state changes
    this.addStateListener((state) => {
      console.log(`Database state changed to: ${state}`);
    });
  }

  public static getInstance(): DatabaseStateMachine {
    if (!DatabaseStateMachine.instance) {
      DatabaseStateMachine.instance = new DatabaseStateMachine();
    }
    return DatabaseStateMachine.instance;
  }

  public getCurrentState(): DatabaseState {
    return this.currentState;
  }

  public addStateListener(listener: (state: DatabaseState) => void): void {
    this.stateListeners.push(listener);
  }

  public async waitForInitialization(): Promise<void> {
    if (this.currentState === 'ready') {
      return Promise.resolve();
    }
    if (this.currentState === 'error') {
      return Promise.reject(new Error('Database is in error state'));
    }
    console.log('Waiting for database initialization...');
    return this.initializationPromise!;
  }

  private setState(newState: DatabaseState): void {
    console.log(`Database state transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
    this.stateListeners.forEach(listener => listener(newState));
    
    if (newState === 'ready' && this.initializeResolve) {
      console.log('Database is ready, resolving initialization promise');
      this.initializeResolve();
      this.processQueue();
    } else if (newState === 'error' && this.initializeReject) {
      console.log('Database entered error state, rejecting initialization promise');
      this.initializeReject(new Error('Database initialization failed'));
    }

    // Show toast notifications for state changes
    switch (newState) {
      case 'ready':
        toast({
          title: "Database Ready",
          description: "Database is now ready for operations",
        });
        break;
      case 'error':
        toast({
          title: "Database Error",
          description: "An error occurred with the database",
          variant: "destructive",
        });
        break;
    }
  }

  public async queueOperation<T>(
    operation: () => Promise<T>, 
    priority: number = 1
  ): Promise<T> {
    console.log(`Queueing operation with priority ${priority}, current state: ${this.currentState}`);
    
    if (this.currentState === 'ready' && !this.isProcessingQueue) {
      try {
        return await operation();
      } catch (error) {
        console.error('Operation failed:', error);
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      const queuedOperation: QueuedOperation = {
        operation: async () => operation(),
        resolve,
        reject,
        retryCount: 0,
        timestamp: Date.now(),
        priority
      };
      
      this.operationQueue.push(queuedOperation);
      // Sort queue by priority (higher first) and then by timestamp (older first)
      this.operationQueue.sort((a, b) => 
        b.priority - a.priority || a.timestamp - b.timestamp
      );
      
      if (this.currentState === 'uninitialized') {
        console.log('Database uninitialized, triggering initialization');
        this.initialize().catch(error => {
          console.error('Initialization failed:', error);
          reject(error);
        });
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`Processing operation queue (${this.operationQueue.length} operations)`);
    
    while (this.operationQueue.length > 0 && this.currentState === 'ready') {
      const operation = this.operationQueue.shift();
      if (!operation) continue;

      try {
        console.log(`Executing queued operation (attempt ${operation.retryCount + 1})`);
        const result = await operation.operation();
        operation.resolve(result);
        console.log('Operation completed successfully');
      } catch (error) {
        console.error('Error executing queued operation:', error);
        
        if (operation.retryCount < this.MAX_RETRIES) {
          operation.retryCount++;
          console.log(`Retrying operation (attempt ${operation.retryCount}/${this.MAX_RETRIES})`);
          // Re-queue with same priority but updated timestamp
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

    this.isProcessingQueue = false;
  }

  public async initialize(): Promise<void> {
    if (this.currentState === 'initializing') {
      console.log('Database already initializing');
      return this.waitForInitialization();
    }

    if (this.currentState === 'ready') {
      console.log('Database already initialized');
      return Promise.resolve();
    }

    try {
      this.setState('initializing');
      await this.initializeDatabase();
      this.setState('ready');
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.setState('error');
      throw error;
    }
  }

  private async initializeDatabase(): Promise<void> {
    // Add initialization delay for testing
    console.log('Starting database initialization...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Database initialization completed');
  }

  public markAsError(error: Error): void {
    console.error('Database error occurred:', error);
    this.setState('error');
    // Reject all queued operations
    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();
      if (operation) {
        operation.reject(new Error('Database entered error state'));
      }
    }
  }

  public reset(): void {
    console.log('Resetting database state machine');
    this.setState('uninitialized');
    this.operationQueue = [];
    this.isProcessingQueue = false;
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
  }
}