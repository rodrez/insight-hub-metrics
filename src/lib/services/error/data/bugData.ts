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
    title: "Memory Management in Database Operations",
    description: "Potential memory leaks in database transaction handling due to uncleaned listeners and connections",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "Application performance degradation and memory issues over time",
    suggestedFix: "Implement proper cleanup of database connections, transaction listeners, and implement connection pooling"
  },
  {
    id: "BUG-002",
    title: "Error Recovery Enhancement",
    description: "Insufficient error recovery mechanisms in database operations",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "No automatic recovery from temporary failures",
    suggestedFix: "Implement comprehensive retry logic with exponential backoff and circuit breaker pattern"
  },
  {
    id: "BUG-003",
    title: "Type Safety in Database Layer",
    description: "Incomplete TypeScript types in database services and operations",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/*",
    impact: "Potential runtime errors and reduced code reliability",
    suggestedFix: "Add comprehensive TypeScript types, interfaces, and proper type guards"
  },
  {
    id: "BUG-004",
    title: "Loading State Management",
    description: "Inconsistent loading state handling across components",
    severity: "medium",
    status: "active",
    location: "Multiple components",
    impact: "Poor user feedback during async operations",
    suggestedFix: "Implement consistent loading states with skeleton loaders and loading indicators"
  },
  {
    id: "BUG-005",
    title: "Component Size Optimization",
    description: "Several components exceed recommended size and complexity",
    severity: "medium",
    status: "active",
    location: "src/pages/Wiki.tsx, src/components/projects/ProjectDetails.tsx",
    impact: "Reduced maintainability and potential performance issues",
    suggestedFix: "Split large components into smaller, focused subcomponents and custom hooks"
  },
  {
    id: "BUG-006",
    title: "Data Validation Enhancement",
    description: "Inconsistent data validation patterns in form submissions",
    severity: "medium",
    status: "active",
    location: "src/components/wiki/components/*, src/components/projects/*",
    impact: "Potential data integrity issues and inconsistent user experience",
    suggestedFix: "Standardize validation using zod schemas and implement consistent error handling"
  },
  {
    id: "BUG-007",
    title: "React Query Optimization",
    description: "Suboptimal query invalidation and caching strategies",
    severity: "medium",
    status: "active",
    location: "src/components/data/hooks/useDataPopulation.ts",
    impact: "Unnecessary refetches and potential stale data",
    suggestedFix: "Implement optimistic updates and proper query invalidation strategies"
  },
  {
    id: "BUG-008",
    title: "Accessibility Improvements",
    description: "Missing ARIA attributes and keyboard navigation in interactive components",
    severity: "medium",
    status: "active",
    location: "src/components/wiki/*, src/components/projects/*",
    impact: "Poor accessibility for users with disabilities",
    suggestedFix: "Add proper ARIA labels, roles, and keyboard navigation support"
  },
  {
    id: "BUG-009",
    title: "State Management Refactor",
    description: "Local state management could be optimized using context or global state",
    severity: "low",
    status: "active",
    location: "src/components/settings/*, src/components/wiki/*",
    impact: "Complex prop drilling and potential state inconsistencies",
    suggestedFix: "Implement React Context or global state management for shared state"
  },
  {
    id: "BUG-010",
    title: "Code Documentation",
    description: "Insufficient documentation in complex business logic components",
    severity: "low",
    status: "active",
    location: "src/lib/services/*, src/components/data/*",
    impact: "Reduced maintainability and harder onboarding for new developers",
    suggestedFix: "Add comprehensive JSDoc comments and improve inline documentation"
  }
];