import { toast } from "@/components/ui/use-toast";

export type DatabaseState = 'uninitialized' | 'initializing' | 'ready' | 'error';

interface QueuedOperation {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export class DatabaseStateMachine {
  private static instance: DatabaseStateMachine;
  private currentState: DatabaseState = 'uninitialized';
  private operationQueue: QueuedOperation[] = [];
  private stateListeners: ((state: DatabaseState) => void)[] = [];

  private constructor() {}

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

  private setState(newState: DatabaseState): void {
    console.log(`Database state transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
    this.stateListeners.forEach(listener => listener(newState));
    
    if (newState === 'ready') {
      this.processQueue();
    }
  }

  public async queueOperation<T>(operation: () => Promise<T>): Promise<T> {
    if (this.currentState === 'ready') {
      return operation();
    }

    if (this.currentState === 'error') {
      throw new Error('Database is in error state. Please reinitialize.');
    }

    return new Promise((resolve, reject) => {
      console.log('Queueing operation - current state:', this.currentState);
      this.operationQueue.push({
        operation,
        resolve,
        reject
      });
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
      } catch (error) {
        console.error('Error executing queued operation:', error);
        operation.reject(error);
      }
    }
  }

  public async initialize(): Promise<void> {
    if (this.currentState === 'initializing') {
      console.log('Database already initializing');
      return;
    }

    if (this.currentState === 'ready') {
      console.log('Database already initialized');
      return;
    }

    try {
      this.setState('initializing');
      // Initialization logic will be added here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated initialization
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
  }
}