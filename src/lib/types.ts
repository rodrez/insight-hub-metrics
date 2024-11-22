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
  budget: number;
  status: 'active' | 'completed' | 'on-hold';
  nabc?: NABC;
  milestones?: Milestone[];
  metrics?: ProjectMetric[];
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
};

export type ProjectMetric = {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
};