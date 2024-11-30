class BugTracker {
  private bugs: any[] = [
    {
      id: "BUG-001",
      title: "Fortune 30 Partner Selection Not Persisting",
      description: "When selecting a Fortune 30 partner in forms, the selection doesn't persist in the UI after saving",
      severity: "critical",
      status: "active",
      location: "src/components/spi/form/SelectFields.tsx",
      impact: "Users cannot properly manage Fortune 30 partner associations",
      stepsToReproduce: "1. Open SPI form\n2. Select a Fortune 30 partner\n3. Save the form\n4. Reopen the form",
      suggestedFix: "Implement proper state management for partner selection and verify data persistence"
    },
    {
      id: "BUG-002",
      title: "Edit Form Data Pre-population Issue",
      description: "Form fields not showing existing data when edit dialogs are opened",
      severity: "high",
      status: "active",
      location: "src/components/spi/SPIEditForm.tsx",
      impact: "Users cannot see current values before making changes",
      stepsToReproduce: "1. Click edit on any existing item\n2. Observe form fields",
      suggestedFix: "Initialize form fields with current data using useEffect and proper state management"
    },
    {
      id: "BUG-003",
      title: "Missing Form Validation",
      description: "Forms lack proper validation before submission",
      severity: "high",
      status: "active",
      location: "Multiple form components",
      impact: "Invalid or incomplete data can be submitted to the database",
      stepsToReproduce: "1. Submit any form with invalid or missing data",
      suggestedFix: "Implement form validation using React Hook Form with proper validation schemas"
    },
    {
      id: "BUG-004",
      title: "Dialog Accessibility Issues",
      description: "Dialog components missing proper ARIA labels and descriptions",
      severity: "medium",
      status: "active",
      location: "All dialog components",
      impact: "Reduced accessibility for screen readers and keyboard navigation",
      stepsToReproduce: "1. Open any dialog\n2. Check console for accessibility warnings",
      suggestedFix: "Add proper ARIA labels and descriptions to all dialog components"
    },
    {
      id: "BUG-005",
      title: "Inconsistent Error Handling",
      description: "Error states not consistently handled across the application",
      severity: "medium",
      status: "active",
      location: "Multiple components",
      impact: "Poor user feedback when operations fail",
      stepsToReproduce: "1. Trigger error conditions in different parts of the app\n2. Observe inconsistent error handling",
      suggestedFix: "Implement consistent error boundary and toast notification system"
    },
    {
      id: "BUG-006",
      title: "Missing Loading States",
      description: "No loading indicators during data operations",
      severity: "medium",
      status: "active",
      location: "Components using data fetching",
      impact: "Poor user experience during data loading",
      stepsToReproduce: "1. Perform any data operation\n2. Observe lack of loading feedback",
      suggestedFix: "Add loading states and skeleton loaders to all data operations"
    },
    {
      id: "BUG-007",
      title: "Database Initialization Issues",
      description: "Multiple database initialization attempts occurring",
      severity: "high",
      status: "active",
      location: "src/lib/services/IndexedDBService.ts",
      impact: "Potential performance impact and race conditions",
      stepsToReproduce: "1. Check console logs for multiple initialization attempts",
      suggestedFix: "Implement proper singleton pattern for database initialization"
    }
  ];

  getAllBugs() {
    return this.bugs;
  }

  async updateBugStatus(id: string, status: string) {
    const bugIndex = this.bugs.findIndex(bug => bug.id === id);
    if (bugIndex !== -1) {
      this.bugs[bugIndex].status = status;
    }
  }
}

export const bugTracker = new BugTracker();