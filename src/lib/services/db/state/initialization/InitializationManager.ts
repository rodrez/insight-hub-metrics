import { toast } from "@/components/ui/use-toast";
import { DatabaseState } from "../events/StateEventEmitter";

export class InitializationManager {
  private initializationPromise: Promise<void> | null = null;
  private initializeResolve: (() => void) | null = null;
  private initializeReject: ((error: Error) => void) | null = null;

  constructor() {
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
  }

  public async waitForInitialization(): Promise<void> {
    return this.initializationPromise!;
  }

  public handleStateChange(newState: DatabaseState): void {
    if (newState === 'ready' && this.initializeResolve) {
      console.log('Database is ready, resolving initialization promise');
      this.initializeResolve();
      toast({
        title: "Database Ready",
        description: "Database is now ready for operations",
      });
    } else if (newState === 'error' && this.initializeReject) {
      console.log('Database entered error state, rejecting initialization promise');
      this.initializeReject(new Error('Database initialization failed'));
      toast({
        title: "Database Error",
        description: "An error occurred with the database",
        variant: "destructive",
      });
    }
  }

  public reset(): void {
    this.initializationPromise = new Promise((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
    });
  }
}