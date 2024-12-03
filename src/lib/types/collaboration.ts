export type AgreementStatus = 'signed' | 'pending' | 'expired';
export type AgreementType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: AgreementStatus;
};

export type CollaboratorAgreements = {
  nda?: Agreement;
  jtda?: Agreement;
};

export type ContactPerson = {
  name: string;
  role: string;
  email: string;
  phone?: string;
};

export type Workstream = {
  id: string;
  title: string;
  objectives: string;
  nextSteps: string;
  keyContacts: ContactPerson[];
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  lastUpdated: string;
  ratMember?: string;
};

export type CollaboratorType = 'fortune30' | 'internal' | 'sme';

export type CollaboratorStats = {
  fortune30Count: number;
  internalCount: number;
  smeCount: number;
  total: number;
};

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
  type: CollaboratorType;
  color?: string;
  agreements?: CollaboratorAgreements;
  primaryContact?: ContactPerson;
  workstreams?: Workstream[];
  ratMember?: string;
};