export type AgreementStatus = 'signed' | 'pending' | 'expired';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: AgreementStatus;
};

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects: string[];
  lastActive: string;
  type?: 'fortune30' | 'other';
  color?: string;
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};