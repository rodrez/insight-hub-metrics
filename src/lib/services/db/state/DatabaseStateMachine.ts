import { QueueManager } from "./queue/QueueManager";
import { StateEventEmitter, DatabaseState } from "./events/StateEventEmitter";
import { InitializationManager } from "./initialization/InitializationManager";

export class DatabaseStateMachine {
  private static instance: DatabaseStateMachine;
  private queueManager: QueueManager;
  private stateEmitter: StateEventEmitter;
  private initManager: InitializationManager;

  private constructor() {
    this.queueManager = new QueueManager();
    this.stateEmitter = new StateEventEmitter();
    this.initManager = new InitializationManager();
    
    // Add logging for state changes
    this.stateEmitter.addStateListener((state) => {
      console.log(`Database state changed to: ${state}`);
      this.initManager.handleStateChange(state);
      if (state === 'ready') {
        this.queueManager.processQueue(true);
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
    return this.initManager.waitForInitialization();
  }

  public async queueOperation<T>(
    operation: () => Promise<T>, 
    priority: number = 1
  ): Promise<T> {
    console.log(`Queueing operation with priority ${priority}, current state: ${this.getCurrentState()}`);
    
    if (this.getCurrentState() === 'ready') {
      try {
        return await operation();
      } catch (error) {
        console.error('Operation failed:', error);
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      this.queueManager.enqueue({
        operation: async () => operation(),
        resolve,
        reject,
        retryCount: 0,
        timestamp: Date.now(),
        priority
      });
      
      if (this.getCurrentState() === 'uninitialized') {
        console.log('Database uninitialized, triggering initialization');
        this.initialize().catch(error => {
          console.error('Initialization failed:', error);
          reject(error);
        });
      }
    });
  }

  public async initialize(): Promise<void> {
    if (this.getCurrentState() === 'initializing') {
      console.log('Database already initializing');
      return this.waitForInitialization();
    }

    if (this.getCurrentState() === 'ready') {
      console.log('Database already initialized');
      return Promise.resolve();
    }

    try {
      this.stateEmitter.setState('initializing');
      await this.initializeDatabase();
      this.stateEmitter.setState('ready');
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.stateEmitter.setState('error');
      throw error;
    }
  }

  private async initializeDatabase(): Promise<void> {
    console.log('Starting database initialization...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Database initialization completed');
  }

  public markAsError(error: Error): void {
    console.error('Database error occurred:', error);
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