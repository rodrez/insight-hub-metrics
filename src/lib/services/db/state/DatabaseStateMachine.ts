import { QueueManager } from "./queue/QueueManager";
import { StateEventEmitter, DatabaseState } from "./events/StateEventEmitter";
import { InitializationManager } from "./initialization/InitializationManager";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

export class DatabaseStateMachine {
  private static instance: DatabaseStateMachine;
  private queueManager: QueueManager;
  private stateEmitter: StateEventEmitter;
  private initManager: InitializationManager;

  private constructor() {
    console.log('Initializing DatabaseStateMachine');
    this.queueManager = new QueueManager();
    this.stateEmitter = new StateEventEmitter();
    this.initManager = new InitializationManager();
    
    this.stateEmitter.addStateListener((state) => {
      console.log(`Database state changed to: ${state}`);
      this.initManager.handleStateChange(state);
      
      if (state === 'ready') {
        console.log('Database ready, processing queued operations');
        this.queueManager.processQueue(true);
        toast({
          title: "Database Ready",
          description: "Database is initialized and ready for operations",
        });
      } else if (state === 'error') {
        console.error('Database entered error state');
        toast({
          title: "Database Error",
          description: "An error occurred with the database",
          variant: "destructive",
        });
      }
    });
  }

  public static getInstance(): DatabaseStateMachine {
    if (!DatabaseStateMachine.instance) {
      DatabaseStateMachine.instance = new DatabaseStateMachine();
    }
    return DatabaseStateMachine.instance;
  }

  public getCurrentState(): DatabaseState {
    return this.stateEmitter.getCurrentState();
  }

  public addStateListener(listener: (state: DatabaseState) => void): void {
    this.stateEmitter.addStateListener(listener);
  }

  public async waitForInitialization(): Promise<void> {
    console.log('Waiting for database initialization...');
    return this.initManager.waitForInitialization();
  }

  public async queueOperation<T>(
    operation: () => Promise<T>, 
    priority: number = 1
  ): Promise<T> {
    const currentState = this.getCurrentState();
    console.log(`Queueing operation with priority ${priority}, current state: ${currentState}`);
    
    if (currentState === 'ready') {
      try {
        console.log('Executing operation immediately (database ready)');
        return await operation();
      } catch (error) {
        console.error('Operation failed:', error);
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      console.log('Queueing operation for later execution');
      this.queueManager.enqueue({
        operation: async () => {
          try {
            const result = await operation();
            console.log('Queued operation completed successfully');
            return result;
          } catch (error) {
            console.error('Queued operation failed:', error);
            throw error;
          }
        },
        resolve,
        reject,
        retryCount: 0,
        timestamp: Date.now(),
        priority
      });
      
      if (currentState === 'uninitialized') {
        console.log('Database uninitialized, triggering initialization');
        this.initialize().catch(error => {
          console.error('Initialization failed:', error);
          reject(error);
        });
      }
    });
  }

  public async initialize(): Promise<void> {
    const currentState = this.getCurrentState();
    console.log(`Initializing database (current state: ${currentState})`);

    if (currentState === 'initializing') {
      console.log('Database already initializing, waiting...');
      return this.waitForInitialization();
    }

    if (currentState === 'ready') {
      console.log('Database already initialized');
      return Promise.resolve();
    }

    try {
      this.stateEmitter.setState('initializing');
      console.log('Starting database initialization process');
      
      // Actually initialize the database
      await db.init();
      
      console.log('Database initialization successful');
      this.stateEmitter.setState('ready');
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.stateEmitter.setState('error');
      throw error;
    }
  }

  public markAsError(error: Error): void {
    console.error('Marking database as error state:', error);
    this.stateEmitter.setState('error');
    this.queueManager.clear();
  }

  public reset(): void {
    console.log('Resetting database state machine');
    this.stateEmitter.setState('uninitialized');
    this.queueManager.clear();
    this.initManager.reset();
  }
}