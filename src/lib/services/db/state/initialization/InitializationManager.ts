import { toast } from "@/components/ui/use-toast";
import { DatabaseState } from "../events/StateEventEmitter";

export class InitializationManager {
  private initializationPromise: Promise<void> | null = null;
  private initializeResolve: (() => void) | null = null;
  private initializeReject: ((error: Error) => void) | null = null;

  constructor() {
    console.log('Creating new InitializationManager');
    this.resetPromise();
  }

  private resetPromise(): void {
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
  }

  public async waitForInitialization(): Promise<void> {
    console.log('Waiting for initialization to complete');
    return this.initializationPromise!;
  }

  public handleStateChange(newState: DatabaseState): void {
    console.log(`InitializationManager handling state change: ${newState}`);
    
    if (newState === 'ready' && this.initializeResolve) {
      console.log('Database is ready, resolving initialization promise');
      this.initializeResolve();
      toast({
        title: "Database Ready",
        description: "Database is now ready for operations",
      });
    } else if (newState === 'error' && this.initializeReject) {
      console.error('Database initialization failed');
      this.initializeReject(new Error('Database initialization failed'));
      toast({
        title: "Database Error",
        description: "Failed to initialize database",
        variant: "destructive",
      });
    }
  }

  public reset(): void {
    console.log('Resetting initialization manager');
    this.resetPromise();
  }
}