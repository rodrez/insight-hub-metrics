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
    id: "BUG-011",
    title: "Database Operation Queue Overflow",
    description: "Potential memory issues with unbounded operation queue in DatabaseStateMachine",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/state/DatabaseStateMachine.ts",
    impact: "System stability and memory management issues under heavy load",
    suggestedFix: "Implement queue size limits and overflow handling mechanisms"
  },
  {
    id: "BUG-012",
    title: "Race Condition in Database Initialization",
    description: "Multiple initialization attempts can occur simultaneously",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/DatabaseConnectionService.ts",
    impact: "Database connection instability and potential data corruption",
    suggestedFix: "Implement proper initialization locks and synchronization"
  },
  {
    id: "BUG-013",
    title: "Incomplete Error Recovery in Transaction Service",
    description: "Transaction rollbacks not properly handled in all error cases",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/DatabaseTransactionService.ts",
    impact: "Potential data inconsistency during failed transactions",
    suggestedFix: "Implement comprehensive transaction rollback mechanism"
  },
  {
    id: "BUG-014",
    title: "Settings Component Size",
    description: "DepartmentSettings.tsx exceeds recommended component size",
    severity: "medium",
    status: "active",
    location: "src/components/settings/DepartmentSettings.tsx",
    impact: "Reduced maintainability and potential performance issues",
    suggestedFix: "Split into smaller sub-components and custom hooks"
  },
  {
    id: "BUG-015",
    title: "Database Event Memory Leak",
    description: "Event listeners in DatabaseEventEmitter not properly cleaned up",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/events/DatabaseEventEmitter.ts",
    impact: "Memory leaks in long-running applications",
    suggestedFix: "Implement proper event listener cleanup mechanisms"
  },
  {
    id: "BUG-016",
    title: "Retry Logic Enhancement",
    description: "Database operation retries use fixed delay instead of exponential backoff",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/DatabaseTransactionService.ts",
    impact: "Suboptimal handling of temporary failures",
    suggestedFix: "Implement exponential backoff strategy for retries"
  },
  {
    id: "BUG-017",
    title: "State Machine Error Handling",
    description: "Incomplete error state recovery in DatabaseStateMachine",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/state/DatabaseStateMachine.ts",
    impact: "System can get stuck in error state",
    suggestedFix: "Implement proper error state recovery mechanisms"
  },
  {
    id: "BUG-018",
    title: "Wiki Component Optimization",
    description: "Wiki.tsx component has performance issues with large content",
    severity: "low",
    status: "active",
    location: "src/pages/Wiki.tsx",
    impact: "Slower rendering with large wiki content",
    suggestedFix: "Implement virtualization for large content sections"
  },
  {
    id: "BUG-019",
    title: "Toast Notification Overlap",
    description: "Multiple database operation toasts can overlap and become unreadable",
    severity: "low",
    status: "active",
    location: "src/lib/services/db/state/DatabaseStateMachine.ts",
    impact: "Poor user experience with error notifications",
    suggestedFix: "Implement toast grouping and limiting mechanism"
  },
  {
    id: "BUG-020",
    title: "Code Documentation Updates",
    description: "Missing documentation for new database state management system",
    severity: "low",
    status: "active",
    location: "src/lib/services/db/*",
    impact: "Difficulty in maintaining and understanding new state management",
    suggestedFix: "Add comprehensive documentation for state management system"
  }
];