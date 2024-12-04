type DatabaseEventType = 'initializing' | 'ready' | 'error' | 'cleanup';
type DatabaseEventListener = (data?: any) => void;

export class DatabaseEventEmitter {
  private static instance: DatabaseEventEmitter;
  private listeners: Map<DatabaseEventType, Set<DatabaseEventListener>>;

  private constructor() {
    this.listeners = new Map();
  }

  public static getInstance(): DatabaseEventEmitter {
    if (!DatabaseEventEmitter.instance) {
      DatabaseEventEmitter.instance = new DatabaseEventEmitter();
    }
    return DatabaseEventEmitter.instance;
  }

  public emit(event: DatabaseEventType, data?: any) {
    console.log(`Database Event Emitted: ${event}`, data);
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  public on(event: DatabaseEventType, listener: DatabaseEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);
  }

  public off(event: DatabaseEventType, listener: DatabaseEventListener) {
    this.listeners.get(event)?.delete(listener);
  }
}