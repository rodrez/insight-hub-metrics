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
    title: "Type Mismatch in SampleDataService",
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
    title: "DataManagement Component Length",
    description: "DataManagement.tsx is too long (136 lines) and needs refactoring",
    severity: "medium",
    status: "active",
    location: "src/components/data/DataManagement.tsx",
    impact: "Reduced maintainability and potential performance issues",
    suggestedFix: "Split into smaller components: DataHeader, DataControls, and DataDisplay"
  },
  {
    id: "BUG-003",
    title: "Fortune30Settings Component Size",
    description: "Fortune30Settings.tsx is 171 lines long and needs restructuring",
    severity: "medium",
    status: "active",
    location: "src/components/settings/partners/Fortune30Settings.tsx",
    impact: "Code maintainability and readability issues",
    suggestedFix: "Extract partner list and dialog components into separate files"
  },
  {
    id: "BUG-004",
    title: "SMESettings Component Length",
    description: "SMESettings.tsx is 171 lines and requires refactoring",
    severity: "medium",
    status: "active",
    location: "src/components/settings/partners/SMESettings.tsx",
    impact: "Reduced code maintainability and potential performance impact",
    suggestedFix: "Split into SMEList, SMEDialog, and SMEActions components"
  },
  {
    id: "BUG-005",
    title: "Wiki Page Size",
    description: "Wiki.tsx is 197 lines long and needs optimization",
    severity: "medium",
    status: "active",
    location: "src/pages/Wiki.tsx",
    impact: "Page load performance and maintenance challenges",
    suggestedFix: "Extract wiki sections data and search functionality into separate files"
  },
  {
    id: "BUG-006",
    title: "Progress Tracking Enhancement",
    description: "Data population progress tracking needs improvement",
    severity: "low",
    status: "active",
    location: "src/components/data/hooks/useDataPopulation.ts",
    impact: "Limited user feedback during data population",
    suggestedFix: "Add detailed progress tracking for each data type being populated"
  },
  {
    id: "BUG-007",
    title: "Error Handling in DatabaseOperations",
    description: "Database operations lack comprehensive error handling",
    severity: "high",
    status: "active",
    location: "src/components/data/operations/DatabaseOperations.ts",
    impact: "Potential silent failures and data inconsistencies",
    suggestedFix: "Implement detailed error handling with specific error types"
  },
  {
    id: "BUG-008",
    title: "React Query Error Boundaries",
    description: "Missing error boundaries for React Query operations",
    severity: "high",
    status: "active",
    location: "src/components/data/hooks/useDataPopulation.ts",
    impact: "Uncaught query errors may crash the application",
    suggestedFix: "Add error boundaries and error recovery mechanisms"
  },
  {
    id: "BUG-009",
    title: "Data Validation Enhancement",
    description: "Sample data validation needs improvement",
    severity: "medium",
    status: "active",
    location: "src/lib/services/data/DataValidationService.ts",
    impact: "Potential invalid data states in generated content",
    suggestedFix: "Implement comprehensive validation checks for all data types"
  },
  {
    id: "BUG-010",
    title: "Memory Management in Data Population",
    description: "Large dataset population may cause memory issues",
    severity: "high",
    status: "active",
    location: "src/lib/services/IndexedDBService.ts",
    impact: "Browser crashes with large datasets",
    stepsToReproduce: "1. Attempt to populate maximum quantity of sample data",
    suggestedFix: "Implement batch processing with memory monitoring"
  }
];