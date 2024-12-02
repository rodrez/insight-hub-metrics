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
    title: "Database Connection Stability Issues",
    description: "Database connections are being closed while transactions are in progress, causing InvalidStateError exceptions",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/DatabaseTransactionService.ts",
    impact: "Data operations failing, potential data loss or corruption",
    suggestedFix: "Implement connection pooling and improve transaction lifecycle management"
  },
  {
    id: "BUG-002",
    title: "DataManagement Component Size",
    description: "DataManagement.tsx is too large (179 lines) and handles too many responsibilities",
    severity: "medium",
    status: "active",
    location: "src/components/data/DataManagement.tsx",
    impact: "Reduced maintainability and harder to test code",
    suggestedFix: "Split into smaller, focused components (DataHeader, DataControls, DataDisplay)"
  },
  {
    id: "BUG-003",
    title: "Database Initialization Race Conditions",
    description: "Multiple concurrent initialization attempts causing database state inconsistencies",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/DatabaseConnectionService.ts",
    impact: "Application instability and potential data corruption",
    suggestedFix: "Implement proper initialization locking mechanism and state management"
  },
  {
    id: "BUG-004",
    title: "Missing Error Recovery Mechanisms",
    description: "Database operations lack proper error recovery and retry mechanisms",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/operations/*",
    impact: "Failed operations don't automatically recover, requiring manual intervention",
    suggestedFix: "Implement comprehensive retry strategies and error recovery patterns"
  },
  {
    id: "BUG-005",
    title: "Inconsistent Database State Handling",
    description: "Application doesn't properly handle database state transitions and cleanup",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/*",
    impact: "Memory leaks and resource exhaustion",
    suggestedFix: "Implement proper connection cleanup and state management"
  },
  {
    id: "BUG-006",
    title: "Large Component Files",
    description: "Several components exceed recommended size limits (>100 lines)",
    severity: "medium",
    status: "active",
    location: "src/components/settings/*, src/components/data/*",
    impact: "Code maintainability and readability issues",
    suggestedFix: "Refactor large components into smaller, focused components"
  },
  {
    id: "BUG-007",
    title: "Missing Loading States",
    description: "Database operations don't properly indicate loading states",
    severity: "low",
    status: "active",
    location: "src/components/data/DataManagement.tsx",
    impact: "Poor user experience during data operations",
    suggestedFix: "Add loading indicators and proper state management for all async operations"
  },
  {
    id: "BUG-008",
    title: "Insufficient Error Feedback",
    description: "Users aren't properly notified of database operation failures",
    severity: "medium",
    status: "active",
    location: "Multiple components handling database operations",
    impact: "Poor error visibility and user experience",
    suggestedFix: "Implement consistent error notification system using toast messages"
  },
  {
    id: "BUG-009",
    title: "Missing Data Validation",
    description: "Data operations lack comprehensive input validation",
    severity: "high",
    status: "active",
    location: "src/lib/services/data/*, src/components/data/*",
    impact: "Potential data integrity issues",
    suggestedFix: "Implement Zod schemas for all data operations"
  },
  {
    id: "BUG-010",
    title: "Inefficient Query Management",
    description: "React Query configurations could be optimized for better performance",
    severity: "low",
    status: "active",
    location: "src/components/data/hooks/*",
    impact: "Suboptimal application performance",
    suggestedFix: "Optimize query configurations and implement proper caching strategies"
  }
];