type InitializationState = {
  promise: Promise<void>;
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
};

export class InitializationQueue {
  private currentInitialization: InitializationState | null = null;
  private pendingInitializations: InitializationState[] = [];

  startInitialization(): void {
    const state = this.createInitializationState();
    this.currentInitialization = state;
  }

  private createInitializationState(): InitializationState {
    let resolve: (value: void | PromiseLike<void>) => void;
    let reject: (reason?: any) => void;
    
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return {
      promise,
      resolve: resolve!,
      reject: reject!
    };
  }

  waitForInitialization(): Promise<void> {
    if (!this.currentInitialization) {
      console.warn('No initialization in progress, creating new initialization state');
      this.startInitialization();
    }

    const state = this.createInitializationState();
    this.pendingInitializations.push(state);
    return state.promise;
  }

  completeInitialization(): void {
    if (this.currentInitialization) {
      this.currentInitialization.resolve();
      this.resolvePendingInitializations();
    }
    this.reset();
  }

  failInitialization(error: any): void {
    if (this.currentInitialization) {
      this.currentInitialization.reject(error);
      this.rejectPendingInitializations(error);
    }
    this.reset();
  }

  private resolvePendingInitializations(): void {
    this.pendingInitializations.forEach(state => state.resolve());
  }

  private rejectPendingInitializations(error: any): void {
    this.pendingInitializations.forEach(state => state.reject(error));
  }

  private reset(): void {
    this.currentInitialization = null;
    this.pendingInitializations = [];
  }
}