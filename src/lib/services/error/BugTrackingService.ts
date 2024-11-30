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
      id: "DB-001",
      severity: "critical",
      title: "Database Initialization Race Condition",
      description: "Multiple simultaneous database initialization attempts can cause race conditions and connection issues",
      location: "src/lib/services/db/DatabaseConnectionService.ts",
      impact: "Database operations may fail or become inconsistent",
      stepsToReproduce: "Rapidly refresh the application multiple times while database is initializing",
      suggestedFix: "Implement proper connection pooling and singleton pattern for database initialization",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "DATA-002",
      severity: "critical",
      title: "Data Validation Type Mismatch",
      description: "DataQuantities interface is inconsistent across different parts of the application",
      location: "src/lib/types/data.ts and related files",
      impact: "Type errors preventing application from building correctly",
      suggestedFix: "Standardize DataQuantities interface and ensure consistent usage across all files",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "PERF-003",
      severity: "high",
      title: "Memory Leak in Data Population",
      description: "useDataPopulation hook doesn't properly cleanup resources and event listeners",
      location: "src/components/data/hooks/useDataPopulation.ts",
      impact: "Memory usage increases over time, potentially causing performance issues",
      suggestedFix: "Add proper cleanup in useEffect hooks and implement proper resource disposal",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "ERR-004",
      severity: "high",
      title: "Inconsistent Error Handling",
      description: "Error handling is not standardized across components and services",
      location: "Multiple components and services",
      impact: "Unpredictable error behavior and poor user feedback",
      suggestedFix: "Implement centralized error handling using ErrorHandlingService consistently",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "TRANS-005",
      severity: "high",
      title: "Transaction Timeout Issues",
      description: "Database transactions don't have proper timeout handling",
      location: "src/lib/services/db/transactionManager.ts",
      impact: "Long-running transactions can block other operations",
      suggestedFix: "Implement proper transaction timeout and rollback mechanisms",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "COMP-006",
      severity: "medium",
      title: "Large Component Files",
      description: "Several components exceed recommended size and need refactoring",
      location: "src/components/sitreps/form/SitRepFormContent.tsx and others",
      impact: "Code maintainability and performance issues",
      suggestedFix: "Break down large components into smaller, focused components",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "CACHE-007",
      severity: "medium",
      title: "Query Cache Management",
      description: "React Query cache invalidation is not properly handled",
      location: "Various components using useQuery",
      impact: "Stale data may be displayed to users",
      suggestedFix: "Implement proper cache invalidation strategies and optimistic updates",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "UI-008",
      severity: "medium",
      title: "Accessibility Issues",
      description: "Missing ARIA labels and keyboard navigation support",
      location: "Multiple UI components",
      impact: "Poor accessibility for users with disabilities",
      suggestedFix: "Add proper ARIA labels and keyboard navigation support",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "LOAD-009",
      severity: "medium",
      title: "Inconsistent Loading States",
      description: "Loading states are not consistently handled across components",
      location: "Various components with data fetching",
      impact: "Poor user experience during loading operations",
      suggestedFix: "Implement consistent loading state handling using LoadingStep interface",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "TEST-010",
      severity: "low",
      title: "Test Coverage Gaps",
      description: "Insufficient test coverage for critical components",
      location: "Project-wide",
      impact: "Increased risk of regressions and bugs",
      suggestedFix: "Add comprehensive test suite using React Testing Library",
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