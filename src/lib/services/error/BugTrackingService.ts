import { errorHandler } from "./ErrorHandlingService";

interface BugReport {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  impact: string;
  stepsToReproduce?: string;
  suggestedFix: string;
  status: 'open' | 'in-progress' | 'resolved';
  dateReported: string;
}

class BugTrackingService {
  private bugs: BugReport[] = [
    {
      id: "TYPE-001",
      severity: "critical",
      title: "DataQuantities Type Mismatch",
      description: "Optional properties in DataQuantities type causing TypeScript errors across multiple services",
      location: "src/lib/services/SampleDataService.ts, DataGenerationService.ts",
      impact: "Build failures and potential runtime data inconsistencies",
      stepsToReproduce: "Check TypeScript compilation errors in affected files",
      suggestedFix: "Update DataQuantities interface to use required properties with fixed quantities",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "DB-002",
      severity: "critical",
      title: "Database Transaction Race Conditions",
      description: "Multiple database operations can cause race conditions during batch processing",
      location: "src/lib/services/db/DatabaseOperations.ts",
      impact: "Data inconsistency and potential data loss during batch operations",
      stepsToReproduce: "Attempt multiple rapid database operations simultaneously",
      suggestedFix: "Implement proper transaction queuing and atomic operations",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "PERF-003",
      severity: "high",
      title: "Memory Leaks in Data Population",
      description: "Large data sets aren't properly cleaned up after population operations",
      location: "src/components/data/hooks/useDataPopulation.ts",
      impact: "Memory usage grows over time, potentially causing crashes",
      stepsToReproduce: "Generate large datasets multiple times without page refresh",
      suggestedFix: "Implement proper cleanup in useEffect hooks and dispose of large objects",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "VAL-004",
      severity: "high",
      title: "Inconsistent Data Validation",
      description: "Data validation is not uniformly applied across all data generation services",
      location: "src/lib/services/data/utils/dataGenerationUtils.ts",
      impact: "Invalid data can be generated and stored in the database",
      stepsToReproduce: "Generate sample data with edge case values",
      suggestedFix: "Implement centralized validation using Zod schemas consistently",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "ASYNC-005",
      severity: "high",
      title: "Unhandled Promise Rejections",
      description: "Several async operations lack proper error handling",
      location: "Multiple data generation and database services",
      impact: "Silent failures and potential data corruption",
      stepsToReproduce: "Trigger database operations with invalid data",
      suggestedFix: "Add proper error handling and recovery mechanisms",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "CACHE-006",
      severity: "medium",
      title: "Stale Cache Issues",
      description: "React Query cache not properly invalidated after data operations",
      location: "src/components/data/hooks/useDataPopulation.ts",
      impact: "UI shows outdated data after operations",
      stepsToReproduce: "Perform data operations and observe UI inconsistencies",
      suggestedFix: "Implement proper cache invalidation strategies",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "PROG-007",
      severity: "medium",
      title: "Inaccurate Progress Tracking",
      description: "Progress indicators don't accurately reflect operation status",
      location: "src/lib/services/data/utils/dataGenerationUtils.ts",
      impact: "Users get misleading feedback about operation progress",
      stepsToReproduce: "Generate large datasets and observe progress indicators",
      suggestedFix: "Implement accurate progress calculation and reporting",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "RETRY-008",
      severity: "medium",
      title: "Ineffective Retry Logic",
      description: "Retry mechanisms don't properly handle all failure scenarios",
      location: "src/lib/utils/loadingRetry.ts",
      impact: "Operations fail permanently without proper recovery attempts",
      stepsToReproduce: "Trigger temporary failures in database operations",
      suggestedFix: "Enhance retry logic with exponential backoff and better error classification",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "UI-009",
      severity: "medium",
      title: "Inconsistent Error Feedback",
      description: "Error messages aren't consistently displayed across the application",
      location: "Various components using toast notifications",
      impact: "Users don't get clear feedback about operation failures",
      stepsToReproduce: "Trigger various error conditions across different operations",
      suggestedFix: "Standardize error handling and user feedback mechanisms",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "CLEAN-010",
      severity: "low",
      title: "Resource Cleanup Issues",
      description: "Database connections and resources aren't always properly cleaned up",
      location: "src/lib/services/db/DatabaseConnectionService.ts",
      impact: "Potential resource leaks during long application usage",
      stepsToReproduce: "Perform multiple database operations over extended periods",
      suggestedFix: "Implement proper resource cleanup and connection pooling",
      status: "open",
      dateReported: new Date().toISOString()
    }
  ];

  getAllBugs(): BugReport[] {
    return this.bugs;
  }

  getBugById(id: string): BugReport | undefined {
    return this.bugs.find(bug => bug.id === id);
  }

  async updateBugStatus(id: string, status: 'open' | 'in-progress' | 'resolved'): Promise<void> {
    const bugIndex = this.bugs.findIndex(bug => bug.id === id);
    if (bugIndex !== -1) {
      this.bugs[bugIndex].status = status;
    }
  }
}

export const bugTracker = new BugTrackingService();