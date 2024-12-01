export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  location: string;
  impact: string;
  stepsToReproduce?: string;
  suggestedFix: string;
}

export const initialBugs: Bug[] = [
  {
    id: "BUG-001",
    title: "Transaction Timeout Handling",
    description: "Transaction timeout handling in TransactionManager needs improvement",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/transactionManager.ts",
    impact: "Long-running transactions may hang indefinitely",
    suggestedFix: "Implement proper cleanup of hanging transactions and add retry mechanism"
  },
  {
    id: "BUG-002",
    title: "Memory Management in Data Stats",
    description: "DataStats component may cause memory leaks due to unmanaged subscriptions",
    severity: "medium",
    status: "active",
    location: "src/components/data/stats/DataStats.tsx",
    impact: "Potential memory leaks in long-running sessions",
    suggestedFix: "Implement proper cleanup in useEffect hooks and unsubscribe from data listeners"
  },
  {
    id: "BUG-003",
    title: "Batch Operation Error Handling",
    description: "DatabaseOperations class lacks proper error handling for batch operations",
    severity: "high",
    status: "active",
    location: "src/components/data/operations/DatabaseOperations.ts",
    impact: "Failed batch operations may leave database in inconsistent state",
    suggestedFix: "Implement transaction rollback and proper error recovery mechanisms"
  },
  {
    id: "BUG-004",
    title: "Type Safety in Fortune30Settings",
    description: "Fortune30Settings component uses 'any' type for editPartner state",
    severity: "low",
    status: "active",
    location: "src/components/settings/partners/Fortune30Settings.tsx",
    impact: "Reduced type safety could lead to runtime errors",
    suggestedFix: "Replace 'any' with proper Collaborator interface type"
  },
  {
    id: "BUG-005",
    title: "IndexedDB Service Initialization",
    description: "Race condition possible during IndexedDB service initialization",
    severity: "critical",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Database operations may fail if executed before initialization completes",
    suggestedFix: "Implement proper initialization queue and status checking"
  },
  {
    id: "BUG-006",
    title: "Project Store Error Propagation",
    description: "ProjectStore error handling doesn't properly propagate errors",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/stores/projectStore.ts",
    impact: "Silent failures in project operations",
    suggestedFix: "Implement proper error propagation and logging mechanism"
  },
  {
    id: "BUG-007",
    title: "Base DB Service Connection Management",
    description: "BaseDBService doesn't properly manage database connections",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "Potential database connection leaks",
    suggestedFix: "Implement proper connection pooling and cleanup"
  },
  {
    id: "BUG-008",
    title: "Settings Page Component Size",
    description: "Several settings components exceed recommended file size",
    severity: "low",
    status: "active",
    location: "src/pages/Settings.tsx",
    impact: "Reduced maintainability and potential performance issues",
    suggestedFix: "Split large components into smaller, focused components"
  },
  {
    id: "BUG-009",
    title: "Bug Tracking Service State Management",
    description: "BugTracker class uses local state instead of persistent storage",
    severity: "medium",
    status: "active",
    location: "src/lib/services/error/BugTrackingService.ts",
    impact: "Bug status changes don't persist across sessions",
    suggestedFix: "Implement proper persistence layer for bug tracking state"
  },
  {
    id: "BUG-010",
    title: "Data Validation Performance",
    description: "DataValidationService performs unnecessary validation steps",
    severity: "medium",
    status: "active",
    location: "src/lib/services/data/DataValidationService.ts",
    impact: "Slower validation process for large datasets",
    suggestedFix: "Optimize validation logic and implement batch processing"
  }
];