export interface SitRep {
  id: string;
  title: string;
  date: string;
  spiId: string;
  projectId?: string;
  update: string;
  challenges?: string;
  nextSteps?: string;
  status: 'pending-review' | 'ready' | 'submitted';
  summary: string;
  departmentId?: string;
  level?: "CEO" | "SVP" | "CTO";
  teams?: string[];
  pointsOfContact?: string[];
  fortune30PartnerId?: string;
  smePartnerId?: string;
}