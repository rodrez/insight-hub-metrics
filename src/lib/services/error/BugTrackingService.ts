import { BugStorageService } from './storage/BugStorageService';
import { Bug, initialBugs } from './data/bugData';
import { db } from '@/lib/db';

class BugTracker {
  private storage: BugStorageService;
  private readonly STORE_NAME = 'bugs';

  constructor() {
    this.storage = new BugStorageService();
  }

  async initializeBugsIfNeeded(): Promise<void> {
    const database = db.getDatabase();
    if (!database) throw new Error('Database not initialized');

    const transaction = database.transaction(this.STORE_NAME, 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const count = await new Promise<number>((resolve) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });

    if (count === 0) {
      console.log('Initializing bugs in database...');
      const writeTx = database.transaction(this.STORE_NAME, 'readwrite');
      const writeStore = writeTx.objectStore(this.STORE_NAME);
      
      for (const bug of initialBugs) {
        writeStore.put({ ...bug, status: bug.status || 'active' });
      }
      
      await new Promise((resolve, reject) => {
        writeTx.oncomplete = () => resolve(undefined);
        writeTx.onerror = () => reject(writeTx.error);
      });
      console.log('Bugs initialized successfully');
    }
  }

  async getAllBugs(): Promise<Bug[]> {
    console.log('Getting all bugs...');
    try {
      await this.initializeBugsIfNeeded();
      
      const database = db.getDatabase();
      if (!database) throw new Error('Database not initialized');

      const transaction = database.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const bugs = await new Promise<Bug[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      console.log('Fetched bugs:', bugs);
      return bugs;
    } catch (error) {
      console.error('Error getting bugs:', error);
      throw error;
    }
  }

  async updateBugStatus(id: string, status: string): Promise<void> {
    try {
      const database = db.getDatabase();
      if (!database) throw new Error('Database not initialized');

      const transaction = database.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const bug = await new Promise<Bug | undefined>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!bug) {
        throw new Error(`Bug ${id} not found`);
      }

      await new Promise<void>((resolve, reject) => {
        const updateRequest = store.put({ ...bug, status });
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      });

      console.log(`Updated bug ${id} status to ${status}`);
    } catch (error) {
      console.error('Error updating bug status:', error);
      throw error;
    }
  }
}

export const bugTracker = new BugTracker();