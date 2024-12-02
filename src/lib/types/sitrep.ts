export type SitRepStatus = 'pending-review' | 'ready' | 'submitted';
export type SitRepLevel = 'CEO' | 'SVP' | 'CTO';

export interface SitRep {
  id: string;
  title: string;
  date: string;
  spiId: string;
  update: string;
  challenges: string;
  nextSteps: string;
  status: SitRepStatus;
  level: SitRepLevel;
  summary: string;
  departmentId: string;
  ratMember: string;
  teams?: string[];
  pointsOfContact?: string[];
  fortune30PartnerId?: string;
  smePartnerId?: string;
  poc?: string;
  pocDepartment?: string;
}