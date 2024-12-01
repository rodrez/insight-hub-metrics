class BugTracker {
  private bugs: any[] = [
    {
      id: "BUG-001",
      title: "Database Transaction Timeout Handling",
      description: "Current transaction timeout mechanism needs improvement to prevent hanging transactions",
      severity: "critical",
      status: "active",
      location: "src/lib/services/db/transactionManager.ts",
      impact: "Potential database locks and performance degradation",
      stepsToReproduce: "1. Initiate multiple concurrent database operations\n2. Monitor transaction completion times\n3. Observe potential transaction deadlocks",
      suggestedFix: "Implement robust timeout handling with automatic rollback mechanism"
    },
    {
      id: "BUG-002",
      title: "Memory Usage Optimization",
      description: "Large datasets are not properly paginated in list views",
      severity: "high",
      status: "active",
      location: "src/components/projects/ProjectList.tsx",
      impact: "Performance issues when loading large lists of projects",
      stepsToReproduce: "1. Create 100+ projects\n2. Navigate to project list view\n3. Observe memory usage and loading time",
      suggestedFix: "Implement virtual scrolling and pagination for large lists"
    },
    {
      id: "BUG-003",
      title: "Data Export Format Validation",
      description: "Exported data structure needs schema validation",
      severity: "medium",
      status: "active",
      location: "src/lib/services/db/operations/DataExportService.ts",
      impact: "Potential data integrity issues during export/import operations",
      stepsToReproduce: "1. Export database content\n2. Verify exported data structure",
      suggestedFix: "Add JSON schema validation for exported data"
    },
    {
      id: "BUG-004",
      title: "Settings State Management",
      description: "Settings changes don't persist after page refresh",
      severity: "high",
      status: "active",
      location: "src/components/settings/StatusColorSettings.tsx",
      impact: "User preferences are lost on page reload",
      stepsToReproduce: "1. Change color settings\n2. Refresh page\n3. Observe settings reset",
      suggestedFix: "Implement persistent storage for user settings"
    },
    {
      id: "BUG-005",
      title: "Error Boundary Implementation",
      description: "Missing error boundaries for graceful error handling",
      severity: "medium",
      status: "active",
      location: "src/App.tsx",
      impact: "Uncaught errors can crash the entire application",
      stepsToReproduce: "1. Trigger an unhandled error\n2. Observe application crash",
      suggestedFix: "Add React Error Boundary components at strategic locations"
    },
    {
      id: "BUG-006",
      title: "Form Validation Enhancement",
      description: "Inconsistent form validation across different forms",
      severity: "low",
      status: "active",
      location: "src/components/projects/ProjectDetails.tsx",
      impact: "Inconsistent user experience and potential data quality issues",
      stepsToReproduce: "1. Compare validation across different forms\n2. Note inconsistencies in error messages and validation rules",
      suggestedFix: "Implement centralized form validation system"
    },
    {
      id: "BUG-007",
      title: "Accessibility Improvements",
      description: "Various components need ARIA attributes and keyboard navigation",
      severity: "medium",
      status: "active",
      location: "src/components/ui/*",
      impact: "Limited accessibility for users with disabilities",
      stepsToReproduce: "1. Navigate using keyboard only\n2. Test with screen readers",
      suggestedFix: "Add proper ARIA labels and keyboard navigation support"
    },
    {
      id: "BUG-008",
      title: "Performance Optimization",
      description: "Unnecessary re-renders in dashboard components",
      severity: "high",
      status: "active",
      location: "src/components/dashboard/DepartmentStats.tsx",
      impact: "Dashboard performance degradation with large datasets",
      stepsToReproduce: "1. Open React DevTools\n2. Monitor component re-renders\n3. Observe unnecessary updates",
      suggestedFix: "Implement React.memo and useMemo for expensive calculations"
    },
    {
      id: "BUG-009",
      title: "Data Synchronization",
      description: "Real-time updates not reflecting immediately across components",
      severity: "medium",
      status: "active",
      location: "src/lib/services/db/DatabaseConnectionService.ts",
      impact: "Inconsistent data display across different views",
      stepsToReproduce: "1. Update data in one view\n2. Check other views for immediate updates",
      suggestedFix: "Implement proper data synchronization mechanism"
    },
    {
      id: "BUG-010",
      title: "Mobile Responsiveness",
      description: "UI layout breaks on certain mobile viewports",
      severity: "high",
      status: "active",
      location: "src/components/layout/Navbar.tsx",
      impact: "Poor user experience on mobile devices",
      stepsToReproduce: "1. Open application on various mobile devices\n2. Test different screen orientations",
      suggestedFix: "Implement proper responsive design patterns and testing"
    }
  ];

  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'bugTracker';
  private readonly STORE_NAME = 'bugStatuses';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
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

  private async getStoredStatus(id: string): Promise<string | undefined> {
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

  async getAllBugs() {
    const bugsWithStatus = await Promise.all(
      this.bugs.map(async (bug) => {
        const storedStatus = await this.getStoredStatus(bug.id);
        return {
          ...bug,
          status: storedStatus || bug.status
        };
      })
    );
    return bugsWithStatus;
  }

  async updateBugStatus(id: string, status: string) {
    if (!this.db) {
      console.error("Database not initialized");
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({ id, status });

      request.onsuccess = () => {
        const bugIndex = this.bugs.findIndex(bug => bug.id === id);
        if (bugIndex !== -1) {
          this.bugs[bugIndex] = {
            ...this.bugs[bugIndex],
            status
          };
        }
        resolve();
      };

      request.onerror = () => {
        console.error(`Error updating status for bug ${id}`);
        reject(request.error);
      };
    });
  }
}

export const bugTracker = new BugTracker();