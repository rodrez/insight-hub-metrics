import { errorHandler } from "./ErrorHandlingService";

interface BugReport {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  impact: string;
  stepsToReproduce?: string;
  suggestedFix: string;
  status: 'open' | 'in-progress' | 'resolved';
  dateReported: string;
}

class BugTrackingService {
  private bugs: BugReport[] = [
    {
      id: "TYPE-001",
      severity: "critical",
      title: "DataQuantities Type Mismatch",
      description: "Type validation for DataQuantities is failing due to optional properties in validation schema not matching required interface properties",
      location: "src/components/data/validation/databaseSchemas.ts",
      impact: "Data validation is broken, potentially allowing invalid data to be processed",
      stepsToReproduce: "Check TypeScript errors in build output",
      suggestedFix: "Update validateDataQuantities function to ensure all required properties are properly handled",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "QUERY-002",
      severity: "critical",
      title: "Invalid Query Client Configuration",
      description: "QueryClient configuration contains invalid 'suspense' option causing TypeScript errors",
      location: "src/App.tsx",
      impact: "Application may fail to properly handle data fetching and caching",
      suggestedFix: "Remove invalid 'suspense' option and update QueryClient configuration to use correct options",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "STATE-003",
      severity: "high",
      title: "Inconsistent State Management",
      description: "State updates in components don't properly handle loading and error states",
      location: "Multiple components including DatabaseActions.tsx",
      impact: "Poor user experience and potential UI inconsistencies",
      suggestedFix: "Implement proper loading states and error handling across all components",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "VALID-004",
      severity: "high",
      title: "Missing Data Validation",
      description: "Several components lack proper input validation before processing data",
      location: "src/components/data/* and form components",
      impact: "Potential data corruption and security vulnerabilities",
      suggestedFix: "Add comprehensive validation using Zod schemas for all data inputs",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "PERF-005",
      severity: "high",
      title: "Performance Issues in Settings",
      description: "DepartmentSettings component is too large (251 lines) and needs refactoring",
      location: "src/components/settings/DepartmentSettings.tsx",
      impact: "Code maintainability issues and potential performance problems",
      suggestedFix: "Split into smaller, focused components following single responsibility principle",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "ERR-006",
      severity: "medium",
      title: "Incomplete Error Handling",
      description: "Error handling is inconsistent across components",
      location: "Multiple components",
      impact: "Unpredictable error behavior and poor user feedback",
      suggestedFix: "Implement consistent error handling using ErrorHandlingService",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "UI-007",
      severity: "medium",
      title: "Accessibility Issues",
      description: "Missing ARIA labels and keyboard navigation support in interactive elements",
      location: "Various UI components",
      impact: "Poor accessibility for users with disabilities",
      suggestedFix: "Add proper ARIA labels and keyboard navigation support",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "LOAD-008",
      severity: "medium",
      title: "Missing Loading States",
      description: "Components don't consistently show loading indicators during data operations",
      location: "Multiple data-fetching components",
      impact: "Poor user experience during loading operations",
      suggestedFix: "Add consistent loading states using shadcn/ui components",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "DEPS-009",
      severity: "medium",
      title: "Dependency Management Issues",
      description: "Some components have missing or unnecessary dependencies in useEffect hooks",
      location: "Various React components",
      impact: "Potential memory leaks and unnecessary re-renders",
      suggestedFix: "Review and update effect dependencies across components",
      status: "open",
      dateReported: new Date().toISOString()
    },
    {
      id: "TEST-010",
      severity: "low",
      title: "Insufficient Test Coverage",
      description: "Many components lack proper unit tests",
      location: "Project-wide",
      impact: "Increased risk of regressions and bugs",
      suggestedFix: "Add comprehensive test suite using React Testing Library",
      status: "open",
      dateReported: new Date().toISOString()
    }
  ];

  getAllBugs(): BugReport[] {
    return this.bugs;
  }

  getBugById(id: string): BugReport | undefined {
    return this.bugs.find(bug => bug.id === id);
  }

  updateBugStatus(id: string, status: 'open' | 'in-progress' | 'resolved'): void {
    const bugIndex = this.bugs.findIndex(bug => bug.id === id);
    if (bugIndex !== -1) {
      this.bugs[bugIndex].status = status;
    }
  }
}

export const bugTracker = new BugTrackingService();