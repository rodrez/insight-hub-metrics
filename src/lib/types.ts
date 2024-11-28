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
  budget: number;
  spent: number;
  businessImpact?: number;  // New field
  status: 'active' | 'completed' | 'delayed' | 'action-needed';
  collaborators: Collaborator[];
  internalPartners?: Collaborator[];
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

export type CollaborationType = 'fortune30' | 'other';

export type CollaboratorProject = {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'completed' | 'delayed' | 'action-needed';
  nabc?: {
    needs: string;
  };
};

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects: CollaboratorProject[];
  lastActive: string;
  type: CollaborationType;
  color?: string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};

export type AgreementStatus = 'signed' | 'pending' | 'expired';
export type AgreementType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: AgreementStatus;
};