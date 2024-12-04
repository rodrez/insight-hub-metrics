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
    title: "Component Size Optimization",
    description: "DatabaseActions and SampleDataSettings components exceed recommended size limits",
    severity: "high",
    status: "active",
    location: "src/components/data/DatabaseActions.tsx, src/components/settings/SampleDataSettings.tsx",
    impact: "Reduces maintainability and makes testing more difficult",
    suggestedFix: "Split components into smaller, focused subcomponents and move logic to custom hooks"
  },
  {
    id: "BUG-002",
    title: "Toast Duration Configuration",
    description: "Toast notifications disappear too quickly for users to read longer messages",
    severity: "medium",
    status: "active",
    location: "src/hooks/use-toast.ts",
    impact: "Users might miss important notifications",
    suggestedFix: "Implement dynamic toast duration based on message length and type"
  },
  {
    id: "BUG-003",
    title: "Mobile Navigation Enhancement",
    description: "PullDownMenu component needs better touch interaction and animation smoothness",
    severity: "medium",
    status: "active",
    location: "src/components/layout/PullDownMenu.tsx",
    impact: "Suboptimal mobile user experience",
    suggestedFix: "Implement touch gestures and improve animation performance"
  },
  {
    id: "BUG-004",
    title: "Data Loading States",
    description: "Inconsistent loading state handling across data management components",
    severity: "high",
    status: "active",
    location: "src/components/data/*",
    impact: "Poor user feedback during data operations",
    suggestedFix: "Implement consistent loading states with skeleton loaders"
  },
  {
    id: "BUG-005",
    title: "Form Validation Enhancement",
    description: "Inconsistent form validation patterns across components",
    severity: "medium",
    status: "active",
    location: "Multiple form components",
    impact: "Inconsistent user experience and potential data issues",
    suggestedFix: "Standardize form validation using react-hook-form and zod schemas"
  },
  {
    id: "BUG-006",
    title: "Memory Management",
    description: "Potential memory leaks in transaction management due to uncleaned listeners",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/transactionManager.ts",
    impact: "Application performance degradation over time",
    suggestedFix: "Implement proper cleanup of transaction listeners and timeouts"
  },
  {
    id: "BUG-007",
    title: "Accessibility Compliance",
    description: "Missing ARIA attributes and keyboard navigation in interactive components",
    severity: "high",
    status: "active",
    location: "src/components/layout/*",
    impact: "Poor accessibility for users with disabilities",
    suggestedFix: "Add ARIA labels, roles, and keyboard navigation support"
  },
  {
    id: "BUG-008",
    title: "Error Recovery Mechanism",
    description: "Missing retry mechanism for failed database operations",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/base/BaseIndexedDBService.ts",
    impact: "No automatic recovery from temporary failures",
    suggestedFix: "Implement retry logic with exponential backoff"
  },
  {
    id: "BUG-009",
    title: "Performance Optimization",
    description: "Unnecessary re-renders in data management components",
    severity: "medium",
    status: "active",
    location: "src/components/data/DatabaseActions.tsx",
    impact: "Reduced application performance",
    suggestedFix: "Implement React.memo and useMemo for expensive computations"
  },
  {
    id: "BUG-010",
    title: "Type Safety Enhancement",
    description: "Incomplete TypeScript types in database services",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/*",
    impact: "Potential runtime errors and reduced code reliability",
    suggestedFix: "Add comprehensive TypeScript types and interfaces"
  }
];