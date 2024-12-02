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
    title: "Long Component Files Need Refactoring",
    description: "Several component files exceed recommended length (>150 lines)",
    severity: "medium",
    status: "active",
    location: "src/components/settings/DepartmentSettings.tsx, BugFixesTab.tsx, SampleDataSettings.tsx",
    impact: "Reduced code maintainability and harder to understand components",
    suggestedFix: "Split components into smaller, focused subcomponents and move them to separate files"
  },
  {
    id: "BUG-002",
    title: "Missing Error Boundaries",
    description: "Application lacks error boundaries for graceful error handling",
    severity: "high",
    status: "active",
    location: "src/App.tsx and major feature components",
    impact: "Runtime errors could crash entire application sections",
    suggestedFix: "Implement React Error Boundary components around major feature sections"
  },
  {
    id: "BUG-003",
    title: "Inconsistent Type Usage",
    description: "Some components use 'any' type instead of proper interfaces",
    severity: "medium",
    status: "active",
    location: "src/components/settings/BugFixesTab.tsx",
    impact: "Reduced type safety and potential runtime errors",
    suggestedFix: "Replace 'any' types with proper interfaces and type definitions"
  },
  {
    id: "BUG-004",
    title: "Loading State Improvements",
    description: "Loading states could be enhanced with better user feedback",
    severity: "low",
    status: "active",
    location: "src/components/settings/BugFixesTab.tsx",
    impact: "User experience during loading operations could be improved",
    suggestedFix: "Add loading skeletons and progress indicators for better UX"
  },
  {
    id: "BUG-005",
    title: "Database Service Singleton Pattern",
    description: "Current database service implementation could be improved",
    severity: "medium",
    status: "active",
    location: "src/lib/db.ts",
    impact: "Potential issues with service initialization and state management",
    suggestedFix: "Implement proper singleton pattern with type-safe getInstance method"
  },
  {
    id: "BUG-006",
    title: "Missing Input Validation",
    description: "Some form inputs lack proper validation",
    severity: "high",
    status: "active",
    location: "src/components/settings/sample-data/QuantityInputs.tsx",
    impact: "Could lead to invalid data states or errors",
    suggestedFix: "Add comprehensive input validation using zod or similar validation library"
  },
  {
    id: "BUG-007",
    title: "Performance Optimization Needed",
    description: "Large lists render without virtualization",
    severity: "medium",
    status: "active",
    location: "src/components/settings/BugFixesTab.tsx",
    impact: "Potential performance issues with large datasets",
    suggestedFix: "Implement virtual scrolling for large lists using react-virtual or similar"
  },
  {
    id: "BUG-008",
    title: "Accessibility Improvements",
    description: "Some interactive elements lack proper ARIA attributes",
    severity: "high",
    status: "active",
    location: "Multiple component files",
    impact: "Reduced accessibility for users with assistive technologies",
    suggestedFix: "Add proper ARIA labels and roles to interactive elements"
  },
  {
    id: "BUG-009",
    title: "State Management Refactor",
    description: "Local state could be better managed with global state solution",
    severity: "medium",
    status: "active",
    location: "src/components/settings/DepartmentSettings.tsx",
    impact: "Complex state management across components",
    suggestedFix: "Implement proper state management using React Query or similar solution"
  },
  {
    id: "BUG-010",
    title: "Code Documentation",
    description: "Some complex functions lack proper JSDoc documentation",
    severity: "low",
    status: "active",
    location: "Various utility and service files",
    impact: "Harder for new developers to understand code functionality",
    suggestedFix: "Add comprehensive JSDoc documentation to complex functions and components"
  }
];