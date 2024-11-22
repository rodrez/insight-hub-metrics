export type AgreementStatus = 'signed' | 'pending' | 'expired';
export type AgreementType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: AgreementStatus;
};

export type CollaborationType = 'fortune30' | 'other';

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects: string[];
  lastActive: string;
  type: CollaborationType;
  color?: string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};