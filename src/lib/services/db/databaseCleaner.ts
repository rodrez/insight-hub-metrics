import { DB_CONFIG } from './stores';

export class DatabaseCleaner {
  static async clearDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);

      deleteRequest.onerror = () => {
        reject(new Error('Failed to delete database'));
      };

      deleteRequest.onsuccess = () => {
        resolve();
      };
    });
  }
}