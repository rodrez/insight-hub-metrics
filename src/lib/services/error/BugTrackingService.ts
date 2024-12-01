import { BugStorageService } from './storage/BugStorageService';
import { Bug, initialBugs } from './data/bugData';

class BugTracker {
  private bugs: Bug[] = initialBugs;
  private storage: BugStorageService;

  constructor() {
    this.storage = new BugStorageService();
  }

  async getAllBugs(): Promise<Bug[]> {
    console.log('Getting all bugs...');
    const bugsWithStatus = await Promise.all(
      this.bugs.map(async (bug) => {
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
  }

  async updateBugStatus(id: string, status: string): Promise<void> {
    await this.storage.updateStatus(id, status);
    const bugIndex = this.bugs.findIndex(bug => bug.id === id);
    if (bugIndex !== -1) {
      this.bugs[bugIndex] = {
        ...this.bugs[bugIndex],
        status
      };
    }
  }
}

export const bugTracker = new BugTracker();