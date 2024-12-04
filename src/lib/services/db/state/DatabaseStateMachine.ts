import { toast } from "@/components/ui/use-toast";

export type DatabaseState = 'uninitialized' | 'initializing' | 'ready' | 'error';

interface QueuedOperation {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
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

  private constructor() {
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
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
    return this.initializationPromise!;
  }

  private setState(newState: DatabaseState): void {
    console.log(`Database state transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
    this.stateListeners.forEach(listener => listener(newState));
    
    if (newState === 'ready' && this.initializeResolve) {
      this.initializeResolve();
      this.processQueue();
    } else if (newState === 'error' && this.initializeReject) {
      this.initializeReject(new Error('Database initialization failed'));
    }
  }

  public async queueOperation<T>(operation: () => Promise<T>): Promise<T> {
    if (this.currentState === 'ready') {
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
        retryCount: 0
      };
      
      console.log('Queueing operation, current state:', this.currentState);
      this.operationQueue.push(queuedOperation);
      
      if (this.currentState === 'uninitialized') {
        this.initialize().catch(error => {
          console.error('Initialization failed:', error);
          reject(error);
        });
      }
    });
  }

  private async processQueue(): Promise<void> {
    console.log(`Processing operation queue (${this.operationQueue.length} operations)`);
    
    while (this.operationQueue.length > 0 && this.currentState === 'ready') {
      const operation = this.operationQueue.shift();
      if (!operation) continue;

      try {
        const result = await operation.operation();
        operation.resolve(result);
        console.log('Operation completed successfully');
      } catch (error) {
        console.error('Error executing queued operation:', error);
        
        if (operation.retryCount < this.MAX_RETRIES) {
          operation.retryCount++;
          console.log(`Retrying operation (attempt ${operation.retryCount}/${this.MAX_RETRIES})`);
          this.operationQueue.unshift(operation);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * operation.retryCount));
        } else {
          operation.reject(error);
          toast({
            title: "Operation Failed",
            description: "The operation failed after multiple retry attempts",
            variant: "destructive",
          });
        }
      }
    }
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
      if (!this.initializationPromise) {
        this.initializationPromise = new Promise((resolve, reject) => {
          this.initializeResolve = resolve;
          this.initializeReject = reject;
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState('ready');
      toast({
        title: "Database Ready",
        description: "Database initialized successfully",
      });
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.setState('error');
      toast({
        title: "Database Error",
        description: "Failed to initialize database",
        variant: "destructive",
      });
      throw error;
    }
  }

  public markAsError(error: Error): void {
    console.error('Database error occurred:', error);
    this.setState('error');
    this.operationQueue.forEach(operation => {
      operation.reject(new Error('Database entered error state'));
    });
    this.operationQueue = [];
  }

  public reset(): void {
    this.setState('uninitialized');
    this.operationQueue = [];
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
  }
}