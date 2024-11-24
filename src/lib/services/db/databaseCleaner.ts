import { DB_CONFIG } from './stores';

export class DatabaseCleaner {
  static async clearDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const maxRetries = 3;
      let currentRetry = 0;

      const attemptDeletion = () => {
        currentRetry++;
        console.log(`Attempting database deletion (attempt ${currentRetry}/${maxRetries})...`);
        
        const deleteRequest = indexedDB.deleteDatabase(DB_CONFIG.name);
        
        deleteRequest.onerror = () => {
          const error = deleteRequest.error?.message || 'Unknown error during database deletion';
          console.error('Database deletion error:', error);
          if (currentRetry < maxRetries) {
            setTimeout(attemptDeletion, 1000);
          } else {
            reject(new Error(`Failed to delete database after ${maxRetries} attempts`));
          }
        };
        
        deleteRequest.onsuccess = () => {
          console.log('Database deleted successfully');
          resolve();
        };

        deleteRequest.onblocked = () => {
          console.log('Database deletion blocked, retrying...');
          if (currentRetry < maxRetries) {
            setTimeout(attemptDeletion, 1000);
          } else {
            reject(new Error(`Database deletion blocked after ${maxRetries} attempts`));
          }
        };
      };

      // Start deletion attempt after a small delay to ensure connections are closed
      setTimeout(attemptDeletion, 500);
    });
  }
}