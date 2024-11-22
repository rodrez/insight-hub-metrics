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
};