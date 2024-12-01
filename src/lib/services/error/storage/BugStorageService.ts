export class BugStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'bugTracker';
  private readonly STORE_NAME = 'bugStatuses';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error("Error opening bug tracker database");
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async getStoredStatus(id: string): Promise<string | undefined> {
    if (!this.db) return undefined;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result?.status);
      };

      request.onerror = () => {
        console.error(`Error fetching status for bug ${id}`);
        resolve(undefined);
      };
    });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    if (!this.db) {
      console.error("Database not initialized");
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({ id, status });

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error(`Error updating status for bug ${id}`);
        reject(request.error);
      };
    });
  }
}