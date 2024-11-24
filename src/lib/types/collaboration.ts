export type AgreementStatus = 'signed' | 'pending' | 'expired';
export type AgreementType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: AgreementStatus;
};

export type CollaborationType = 'fortune30' | 'other';

export type CollaboratorProject = {
  id: string;
  name: string;
  description: string;
  status?: 'active' | 'completed' | 'delayed' | 'action-needed';
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