export type Department = {
  id: string;
  name: string;
  type: 'business' | 'functional';
  color: string;
  projectCount: number;
  budget: number;
};

export type Project = {
  id: string;
  name: string;
  departmentId: string;
  poc: string;
  pocDepartment: string;
  techLead: string;
  techLeadDepartment: string;
  ratMember: string;
  budget: number;
  spent: number;
  businessImpact?: number;
  status: 'active' | 'completed' | 'delayed' | 'action-needed';
  collaborators: import('./types/collaboration').Collaborator[];
  internalPartners?: import('./types/collaboration').Collaborator[];
  techDomainId?: string;
  nabc?: NABC;
  milestones?: Milestone[];
  metrics?: ProjectMetric[];
  isSampleData?: boolean;
};

export type NABC = {
  needs: string;
  approach: string;
  benefits: string;
  competition: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
};

export type ProjectMetric = {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
};

export type Team = {
  id: string;
  name: string;
  department?: string;
};

// Re-export all types from collaboration
export * from './types/collaboration';