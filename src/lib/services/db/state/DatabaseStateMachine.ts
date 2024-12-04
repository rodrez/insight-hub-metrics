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
  private initializationPromise: Promise<void> | null = null;
  private initializeResolve: (() => void) | null = null;
  private initializeReject: ((error: Error) => void) | null = null;

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
    try {
      await this.waitForInitialization();
      return operation();
    } catch (error) {
      console.error('Operation failed:', error);
      throw error;
    }
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
      return this.waitForInitialization();
    }

    if (this.currentState === 'ready') {
      console.log('Database already initialized');
      return Promise.resolve();
    }

    try {
      this.setState('initializing');
      // Reset initialization promise if needed
      if (!this.initializationPromise) {
        this.initializationPromise = new Promise((resolve, reject) => {
          this.initializeResolve = resolve;
          this.initializeReject = reject;
        });
      }
      
      // Simulated initialization delay removed in production
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