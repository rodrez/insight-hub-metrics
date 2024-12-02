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
    title: "Type Inconsistency in Data Generation",
    description: "Multiple TypeScript errors in data generation services related to missing or mismatched properties",
    severity: "high",
    status: "active",
    location: "src/lib/services/data/DataGenerationService.ts, SampleDataCoordinator.ts",
    impact: "Build errors and potential runtime issues with data generation",
    suggestedFix: "Update type definitions and ensure consistency across data generation services"
  },
  {
    id: "BUG-002",
    title: "DatabaseConnectionService File Size",
    description: "DatabaseConnectionService.ts is too large (229 lines) and needs refactoring",
    severity: "medium",
    status: "active",
    location: "src/lib/services/db/DatabaseConnectionService.ts",
    impact: "Reduced maintainability and harder to test code",
    suggestedFix: "Split into smaller, focused services (ConnectionManager, CleanupService, etc.)"
  },
  {
    id: "BUG-003",
    title: "Missing Error Boundaries",
    description: "Application lacks proper error boundary components",
    severity: "high",
    status: "active",
    location: "src/App.tsx and major feature components",
    impact: "Uncaught errors could crash entire application sections",
    suggestedFix: "Implement React Error Boundary components around major features"
  },
  {
    id: "BUG-004",
    title: "Inconsistent Data Validation",
    description: "Data validation is not consistently applied across all data generation and input processes",
    severity: "medium",
    status: "active",
    location: "src/lib/services/data/* and related components",
    impact: "Potential data integrity issues and inconsistent validation behavior",
    suggestedFix: "Implement centralized validation using Zod schemas consistently"
  },
  {
    id: "BUG-005",
    title: "Missing Loading States",
    description: "Some async operations lack proper loading state handling",
    severity: "low",
    status: "active",
    location: "Various components using async operations",
    impact: "Poor user experience during data loading",
    suggestedFix: "Add loading skeletons and proper loading state management"
  },
  {
    id: "BUG-006",
    title: "Inefficient Data Generation",
    description: "Sample data generation process could be optimized for better performance",
    severity: "medium",
    status: "active",
    location: "src/lib/services/data/generators/*",
    impact: "Slower than necessary data generation process",
    suggestedFix: "Implement batch processing and optimize generation algorithms"
  },
  {
    id: "BUG-007",
    title: "Missing Unit Tests",
    description: "Critical data generation and validation services lack unit tests",
    severity: "high",
    status: "active",
    location: "src/lib/services/data/*, src/lib/services/db/*",
    impact: "Potential regression issues and harder to maintain code",
    suggestedFix: "Add comprehensive unit tests using Vitest or Jest"
  },
  {
    id: "BUG-008",
    title: "Accessibility Issues",
    description: "Some interactive elements lack proper ARIA attributes and keyboard navigation",
    severity: "high",
    status: "active",
    location: "Multiple component files",
    impact: "Poor accessibility for users with assistive technologies",
    suggestedFix: "Implement proper ARIA labels and keyboard navigation"
  },
  {
    id: "BUG-009",
    title: "Inconsistent Error Handling",
    description: "Error handling patterns vary across the application",
    severity: "medium",
    status: "active",
    location: "Various service and component files",
    impact: "Inconsistent error reporting and handling",
    suggestedFix: "Implement centralized error handling service and consistent patterns"
  },
  {
    id: "BUG-010",
    title: "Performance Optimization Needed",
    description: "Large lists and data sets render without virtualization",
    severity: "medium",
    status: "active",
    location: "src/components/settings/BugFixesTab.tsx and other list components",
    impact: "Performance issues with large datasets",
    suggestedFix: "Implement virtual scrolling using react-virtual or similar solution"
  }
];