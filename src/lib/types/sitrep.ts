export interface SitRep {
  id: string;
  date: string;
  spiId: string;
  update: string;
  challenges: string;
  nextSteps: string;
  status: 'on-track' | 'at-risk';
  summary?: string;
  projectId?: string;
  fortune30Id?: string;
  departmentId?: string;
  partnerId?: string;
}