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
    title: "Agreement Warning System Enhancement",
    description: "Current warning system for NDAs and JTDAs needs improvement to handle edge cases",
    severity: "high",
    status: "active",
    location: "src/components/collaborations/agreements/AgreementsList.tsx",
    impact: "Potential missed warnings for critical agreement expirations",
    stepsToReproduce: "1. Create multiple agreements with varying expiration dates\n2. Check warning triggers for near-expiry dates",
    suggestedFix: "Implement more sophisticated warning system with configurable thresholds and email notifications"
  },
  {
    id: "BUG-002",
    title: "CSV Export Format Optimization",
    description: "CSV exports need better formatting and column organization",
    severity: "medium",
    status: "active",
    location: "src/components/data/actions/ExportActions.tsx",
    impact: "Reduced usability of exported data in spreadsheet applications",
    suggestedFix: "Reorganize CSV columns and add proper headers for better data organization"
  },
  {
    id: "BUG-003",
    title: "Mobile Responsive Design for Agreement Tables",
    description: "Agreement tables don't display properly on mobile devices",
    severity: "high",
    status: "active",
    location: "src/components/collaborations/agreements/AgreementsList.tsx",
    impact: "Poor user experience on mobile devices",
    stepsToReproduce: "1. Open agreements page on mobile device\n2. Observe table layout issues",
    suggestedFix: "Implement responsive design patterns for table display on mobile devices"
  },
  {
    id: "BUG-004",
    title: "Data Validation for Agreement Dates",
    description: "Date validation for agreements needs to be more robust",
    severity: "critical",
    status: "active",
    location: "src/components/collaborations/agreements/AgreementForm.tsx",
    impact: "Potential invalid date entries in agreement records",
    suggestedFix: "Enhance date validation logic and add date range checks"
  },
  {
    id: "BUG-005",
    title: "Performance Optimization for Large Datasets",
    description: "Application slows down with large number of agreements and collaborations",
    severity: "high",
    status: "active",
    location: "src/components/collaborations/CollaborationList.tsx",
    impact: "Degraded performance with large datasets",
    suggestedFix: "Implement virtual scrolling and pagination for large data sets"
  },
  {
    id: "BUG-006",
    title: "Search Functionality Enhancement",
    description: "Search feature needs to include agreement content and metadata",
    severity: "medium",
    status: "active",
    location: "src/components/search/GlobalSearch.tsx",
    impact: "Limited search capabilities for agreements and collaborations",
    suggestedFix: "Extend search functionality to include agreement details and metadata"
  },
  {
    id: "BUG-007",
    title: "Accessibility Improvements for Forms",
    description: "Form elements need better accessibility support",
    severity: "medium",
    status: "active",
    location: "src/components/ui/form.tsx",
    impact: "Limited accessibility for users with disabilities",
    stepsToReproduce: "1. Navigate forms using screen reader\n2. Test keyboard navigation",
    suggestedFix: "Add proper ARIA labels and keyboard navigation support"
  },
  {
    id: "BUG-008",
    title: "Data Backup Automation",
    description: "Manual backup process needs automation",
    severity: "medium",
    status: "active",
    location: "src/components/data/actions/BackupActions.tsx",
    impact: "Risk of data loss due to manual backup process",
    suggestedFix: "Implement automated backup scheduling system"
  },
  {
    id: "BUG-009",
    title: "Error Handling Enhancement",
    description: "Better error messages needed for failed operations",
    severity: "low",
    status: "active",
    location: "src/lib/utils/errorHandling.ts",
    impact: "Unclear error messages for users",
    suggestedFix: "Implement more descriptive error messages and handling"
  },
  {
    id: "BUG-010",
    title: "Dark Mode Color Scheme",
    description: "Some components don't properly support dark mode",
    severity: "low",
    status: "active",
    location: "src/components/theme/ThemeToggle.tsx",
    impact: "Inconsistent dark mode experience",
    stepsToReproduce: "1. Switch to dark mode\n2. Navigate through application\n3. Note inconsistent color schemes",
    suggestedFix: "Update color schemes for all components in dark mode"
  }
];