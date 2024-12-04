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
    title: "OrgChart Component Size",
    description: "OrgPositionCard component exceeds recommended size limits and needs further componentization",
    severity: "medium",
    status: "active",
    location: "src/components/org-chart/OrgPositionCard.tsx",
    impact: "Reduces maintainability and makes testing more difficult",
    suggestedFix: "Split into smaller, focused components for relationship management and data display"
  },
  {
    id: "BUG-002",
    title: "Query Cache Management",
    description: "Inefficient cache invalidation in relationship updates",
    severity: "high",
    status: "active",
    location: "src/components/org-chart/hooks/useRelationshipUpdates.ts",
    impact: "May cause stale data display and inconsistent UI updates",
    suggestedFix: "Implement proper cache invalidation strategies and optimistic updates"
  },
  {
    id: "BUG-003",
    title: "Loading States Handling",
    description: "Incomplete loading state management across components",
    severity: "medium",
    status: "active",
    location: "Multiple components",
    impact: "Poor user experience during data loading and updates",
    suggestedFix: "Add consistent loading states and skeleton loaders"
  },
  {
    id: "BUG-004",
    title: "Error Boundary Implementation",
    description: "Missing error boundaries for graceful error handling",
    severity: "high",
    status: "active",
    location: "src/components/layout",
    impact: "Application may crash entirely on component errors",
    stepsToReproduce: "Trigger an error in any component without error boundary",
    suggestedFix: "Implement error boundaries with fallback UI for major component trees"
  },
  {
    id: "BUG-005",
    title: "Form Validation Enhancement",
    description: "Inconsistent form validation across the application",
    severity: "medium",
    status: "active",
    location: "src/components/data/actions/DataQuantityForm.tsx",
    impact: "Users can submit invalid data in some forms",
    suggestedFix: "Implement consistent form validation using react-hook-form and zod"
  },
  {
    id: "BUG-006",
    title: "Performance Optimization",
    description: "Large component re-renders in relationship management",
    severity: "high",
    status: "active",
    location: "src/components/org-chart/RelationshipDisplay.tsx",
    impact: "Performance degradation with many relationships",
    suggestedFix: "Implement React.memo and useMemo for expensive computations"
  },
  {
    id: "BUG-007",
    title: "Accessibility Improvements",
    description: "Missing ARIA attributes in interactive elements",
    severity: "medium",
    status: "active",
    location: "src/components/org-chart/RelationshipSelectionDialog.tsx",
    impact: "Reduced accessibility for screen readers",
    suggestedFix: "Add proper ARIA labels and roles to all interactive elements"
  },
  {
    id: "BUG-008",
    title: "Mobile Responsiveness",
    description: "Layout issues on mobile devices in org chart view",
    severity: "high",
    status: "active",
    location: "src/components/org-chart/OrgPositionCard.tsx",
    impact: "Poor user experience on mobile devices",
    suggestedFix: "Implement responsive design patterns and mobile-first approach"
  },
  {
    id: "BUG-009",
    title: "Database Transaction Error Handling",
    description: "Insufficient error handling in database operations",
    severity: "critical",
    status: "active",
    location: "src/lib/services/db/base/BaseDBService.ts",
    impact: "Silent failures in database operations",
    suggestedFix: "Implement comprehensive error handling and user feedback"
  },
  {
    id: "BUG-010",
    title: "Type Safety Improvements",
    description: "Missing or incomplete TypeScript types in relationship management",
    severity: "medium",
    status: "active",
    location: "src/components/org-chart/types.ts",
    impact: "Potential runtime errors and reduced code reliability",
    suggestedFix: "Add comprehensive TypeScript types and interfaces"
  }
];