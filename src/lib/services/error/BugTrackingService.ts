class BugTracker {
  private bugs: any[] = [
    {
      id: "BUG-001",
      title: "Data Stats Display Format Issue",
      description: "Data stats component showing range format instead of single number",
      severity: "medium",
      status: "active",
      location: "src/components/data/stats/DataStats.tsx",
      impact: "Incorrect display of data statistics",
      stepsToReproduce: "1. Navigate to any page with data stats\n2. Observe the projects count display",
      suggestedFix: "Update DataStats component to show single number instead of range format"
    },
    {
      id: "BUG-002",
      title: "Database Service Type Definitions",
      description: "TypeScript errors in database service implementation",
      severity: "high",
      status: "active",
      location: "src/lib/services/IndexedDBService.ts",
      impact: "TypeScript compilation errors and potential runtime issues",
      stepsToReproduce: "1. Check TypeScript compilation output\n2. Observe missing interface implementations",
      suggestedFix: "Implement missing methods and fix type definitions in IndexedDBService"
    },
    {
      id: "BUG-003",
      title: "Database Initialization Race Condition",
      description: "Multiple database initialization attempts occurring simultaneously",
      severity: "critical",
      status: "active",
      location: "src/lib/services/IndexedDBService.ts",
      impact: "Potential data corruption and performance issues",
      stepsToReproduce: "1. Monitor console logs during application startup\n2. Observe multiple initialization attempts",
      suggestedFix: "Implement proper initialization state management and singleton pattern"
    }
  ];

  getAllBugs() {
    return this.bugs;
  }

  async updateBugStatus(id: string, status: string) {
    const bugIndex = this.bugs.findIndex(bug => bug.id === id);
    if (bugIndex !== -1) {
      this.bugs[bugIndex].status = status;
    }
  }
}

export const bugTracker = new BugTracker();