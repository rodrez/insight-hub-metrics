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
    title: "Database Population Progress Indicator",
    description: "Progress tracking during database population needs improvement",
    severity: "medium",
    status: "active",
    location: "src/components/data/hooks/useDataPopulation.ts",
    impact: "Users lack clear feedback during data population process",
    stepsToReproduce: "1. Clear database\n2. Attempt to populate with large dataset",
    suggestedFix: "Implement a progress bar component to show real-time population status"
  },
  {
    id: "BUG-002",
    title: "Type Safety in Bug Tracking",
    description: "BugFixesTab uses 'any' type for bugs array",
    severity: "low",
    status: "active",
    location: "src/components/settings/BugFixesTab.tsx",
    impact: "Reduced type safety and potential runtime errors",
    suggestedFix: "Replace 'any[]' with proper Bug interface type"
  },
  {
    id: "BUG-003",
    title: "Database Operations Error Handling",
    description: "Error handling in DatabaseOperations class needs enhancement",
    severity: "high",
    status: "active",
    location: "src/components/data/operations/DatabaseOperations.ts",
    impact: "Insufficient error context for debugging database issues",
    suggestedFix: "Implement detailed error handling with specific error types and messages"
  },
  {
    id: "BUG-004",
    title: "Memory Management in Data Population",
    description: "Large dataset population may cause memory issues",
    severity: "critical",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Potential browser crashes with large datasets",
    stepsToReproduce: "1. Attempt to populate database with maximum quantity values",
    suggestedFix: "Implement batch processing with memory usage monitoring"
  },
  {
    id: "BUG-005",
    title: "Settings Page Load Performance",
    description: "Settings tabs load all content simultaneously",
    severity: "medium",
    status: "active",
    location: "src/pages/Settings.tsx",
    impact: "Slower initial page load and unnecessary resource usage",
    suggestedFix: "Implement lazy loading for tab content"
  },
  {
    id: "BUG-006",
    title: "Data Validation in Sample Data Generation",
    description: "Sample data generation lacks comprehensive validation",
    severity: "high",
    status: "active",
    location: "src/lib/services/data/sampleDataGenerator.ts",
    impact: "Potential invalid data states in generated content",
    suggestedFix: "Add thorough validation checks for generated data"
  },
  {
    id: "BUG-007",
    title: "Component File Size Management",
    description: "Several components exceed recommended file size",
    severity: "medium",
    status: "active",
    location: "Multiple component files",
    impact: "Reduced maintainability and potential performance issues",
    suggestedFix: "Refactor large components into smaller, focused components"
  },
  {
    id: "BUG-008",
    title: "React Query Error Boundary Implementation",
    description: "Missing error boundaries for React Query errors",
    severity: "medium",
    status: "active",
    location: "src/components/data/hooks/useDataPopulation.ts",
    impact: "Uncaught query errors may crash the application",
    suggestedFix: "Implement error boundaries for React Query operations"
  },
  {
    id: "BUG-009",
    title: "IndexedDB Version Management",
    description: "Database version management needs improvement",
    severity: "high",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "Potential issues during database schema updates",
    suggestedFix: "Implement robust version control system for database schema changes"
  },
  {
    id: "BUG-010",
    title: "React Query Cache Configuration",
    description: "Query cache settings need optimization",
    severity: "low",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Suboptimal caching behavior for database operations",
    suggestedFix: "Configure appropriate cache time and stale time for queries"
  }
];