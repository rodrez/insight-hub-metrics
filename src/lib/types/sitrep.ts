export interface SitRep {
  id: string;
  date: string;
  spiId: string;
  title: string;
  content?: string;
  update: string;
  challenges: string;
  nextSteps: string;
  status: 'on-track' | 'at-risk';
  summary?: string;
  projectId?: string;
  fortune30Id?: string;
  departmentId?: string;
  partnerId?: string;
  importanceLevel?: 'vp' | 'svp' | 'ceo';
  keyTeam?: string;
  supportingTeams?: string[];
  pointsOfContact?: Array<{
    name: string;
    email: string;
    title: string;
    department: string;
  }>;
}