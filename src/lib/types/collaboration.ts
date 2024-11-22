export type CollaborationType = 'NDA' | 'JTDA';

export type Agreement = {
  signedDate: string;
  expiryDate: string;
  status: 'signed' | 'pending' | 'expired';
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
  primaryContact?: {
    name: string;
    email: string;
    phone: string;
  };
  agreements?: {
    nda?: Agreement;
    jtda?: Agreement;
  };
};