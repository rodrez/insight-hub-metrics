export type CollaborationType = 'fortune30' | 'sme' | 'internal';

export interface Agreement {
  signedDate: string;
  expiryDate: string;
  status: 'signed' | 'pending' | 'expired';
}

export interface CollaboratorAgreements {
  nda?: Agreement;
  jtda?: Agreement;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Workstream {
  id: string;
  title: string;
  objectives: string;
  nextSteps: string;
  keyContacts: ContactPerson[];
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  lastUpdated: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'delayed' | 'action-needed';
}

export interface CollaboratorStats {
  fortune30Count: number;
  internalCount: number;
  smeCount: number;
  total: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects?: Project[];
  lastActive: string;
  type: CollaborationType;
  color?: string;
  primaryContact?: ContactPerson;
  workstreams?: Workstream[];
  agreements?: CollaboratorAgreements;
  ratMember: string;
}