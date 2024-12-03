import { connectionManager } from '../connectionManager';
import { toast } from "@/components/ui/use-toast";

export class DatabaseCleanup {
  private cleanupTimeout: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL = 300000; // 5 minutes

  constructor(private db: IDBDatabase | null) {}

  startCleanupInterval() {
    if (this.cleanupTimeout) {
      clearInterval(this.cleanupTimeout);
    }
    this.cleanupTimeout = setInterval(() => {
      this.performPeriodicCleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private async performPeriodicCleanup() {
    console.log('Performing periodic connection cleanup');
    if (!this.db) return;

    const isActive = await this.checkConnectionActivity();
    if (!isActive) {
      await this.cleanup();
    }
  }

  private async checkConnectionActivity(): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      const transaction = this.db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      await new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(false);
      });
      return true;
    } catch (error) {
      console.warn('Connection check failed:', error);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    if (this.cleanupTimeout) {
      clearInterval(this.cleanupTimeout);
      this.cleanupTimeout = null;
    }

    if (this.db) {
      try {
        console.log('Closing database connection');
        const stores = Array.from(this.db.objectStoreNames);
        stores.forEach(storeName => {
          try {
            const transaction = this.db!.transaction(storeName, 'readwrite');
            transaction.abort();
          } catch (error) {
            console.warn(`Error aborting transaction for store ${storeName}:`, error);
          }
        });

        connectionManager.removeConnection(this.db);
        this.db.close();
        console.log('Database connection closed successfully');
      } catch (error) {
        console.error('Error during database cleanup:', error);
        throw error;
      }
    }
  }
}