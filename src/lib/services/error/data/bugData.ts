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
    title: "Type Mismatch in Sample Data Service",
    description: "Type error between Collaborator[] and number in sample data generation",
    severity: "critical",
    status: "active",
    location: "src/lib/services/SampleDataService.ts",
    impact: "Prevents successful data population and affects application stability",
    stepsToReproduce: "1. Navigate to Settings\n2. Attempt to populate sample data",
    suggestedFix: "Update type definitions and ensure proper handling of Collaborator arrays vs numeric quantities"
  },
  {
    id: "BUG-002",
    title: "Large Component File Sizes",
    description: "Several components exceed recommended file size limits",
    severity: "medium",
    status: "active",
    location: "src/components/settings/DepartmentSettings.tsx, src/pages/Wiki.tsx",
    impact: "Reduces code maintainability and may affect performance",
    suggestedFix: "Refactor large components into smaller, focused components and move logic to custom hooks"
  },
  {
    id: "BUG-003",
    title: "Database Operations Error Handling",
    description: "Insufficient error handling in database operations",
    severity: "high",
    status: "active",
    location: "src/components/data/operations/DatabaseOperations.ts",
    impact: "Poor error feedback and potential data inconsistencies",
    suggestedFix: "Implement comprehensive error handling with specific error types and user-friendly messages"
  },
  {
    id: "BUG-004",
    title: "Memory Management in Data Population",
    description: "Large dataset population may cause memory issues",
    severity: "high",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Potential browser crashes with large datasets",
    stepsToReproduce: "1. Attempt to populate database with maximum quantity values",
    suggestedFix: "Implement batch processing with memory usage monitoring"
  },
  {
    id: "BUG-005",
    title: "Progress Tracking Enhancement",
    description: "Limited feedback during long-running operations",
    severity: "medium",
    status: "active",
    location: "src/components/data/DatabaseActions.tsx",
    impact: "Users lack clear progress indication during data operations",
    suggestedFix: "Add detailed progress tracking and status updates for long-running operations"
  },
  {
    id: "BUG-006",
    title: "Data Validation Coverage",
    description: "Incomplete data validation in sample data generation",
    severity: "high",
    status: "active",
    location: "src/lib/services/data/generators/projectGenerator.ts",
    impact: "Risk of invalid data states in generated content",
    suggestedFix: "Implement comprehensive validation checks for all generated data"
  },
  {
    id: "BUG-007",
    title: "React Query Configuration",
    description: "Suboptimal React Query cache settings",
    severity: "medium",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Inefficient data caching and potential stale data issues",
    suggestedFix: "Optimize React Query cache configuration and implement proper invalidation strategies"
  },
  {
    id: "BUG-008",
    title: "Database Schema Version Management",
    description: "Lack of robust database versioning system",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "Potential issues during database schema updates",
    suggestedFix: "Implement comprehensive database schema versioning and migration system"
  },
  {
    id: "BUG-009",
    title: "Performance Optimization Needed",
    description: "Render optimization opportunities in large lists",
    severity: "medium",
    status: "active",
    location: "src/components/projects/ProjectList.tsx",
    impact: "Potential performance issues with large datasets",
    suggestedFix: "Implement virtualization for large lists and optimize render performance"
  },
  {
    id: "BUG-010",
    title: "Accessibility Improvements",
    description: "Missing ARIA labels and keyboard navigation",
    severity: "medium",
    status: "active",
    location: "Multiple components",
    impact: "Reduced accessibility for users with disabilities",
    suggestedFix: "Add proper ARIA labels and implement complete keyboard navigation support"
  }
];