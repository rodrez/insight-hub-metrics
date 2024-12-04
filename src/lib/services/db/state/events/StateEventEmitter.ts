export type DatabaseState = 'uninitialized' | 'initializing' | 'ready' | 'error';

export class StateEventEmitter {
  private stateListeners: ((state: DatabaseState) => void)[] = [];
  private currentState: DatabaseState = 'uninitialized';

  public getCurrentState(): DatabaseState {
    return this.currentState;
  }

  public addStateListener(listener: (state: DatabaseState) => void): void {
    this.stateListeners.push(listener);
  }

  public setState(newState: DatabaseState): void {
    console.log(`Database state transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
    this.stateListeners.forEach(listener => {
      try {
        listener(newState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }
}