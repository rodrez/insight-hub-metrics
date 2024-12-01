import { BugStorageService } from './storage/BugStorageService';
import { Bug, initialBugs } from './data/bugData';

class BugTracker {
  private storage: BugStorageService;

  constructor() {
    this.storage = new BugStorageService();
  }

  async getAllBugs(): Promise<Bug[]> {
    console.log('Getting all bugs...');
    try {
      const bugsWithStatus = await Promise.all(
        initialBugs.map(async (bug) => {
          const storedStatus = await this.storage.getStoredStatus(bug.id);
          console.log(`Bug ${bug.id} stored status:`, storedStatus);
          return {
            ...bug,
            status: storedStatus || bug.status || 'active'
          };
        })
      );
      console.log('Bugs with status:', bugsWithStatus);
      return bugsWithStatus;
    } catch (error) {
      console.error('Error getting bugs:', error);
      throw error;
    }
  }

  async updateBugStatus(id: string, status: string): Promise<void> {
    try {
      await this.storage.updateStatus(id, status);
      console.log(`Updated bug ${id} status to ${status}`);
    } catch (error) {
      console.error('Error updating bug status:', error);
      throw error;
    }
  }
}

export const bugTracker = new BugTracker();