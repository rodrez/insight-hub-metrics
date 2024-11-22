export type CollaborationType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  type: CollaborationType;
  signedDate: string;
  expiryDate: string;
  status?: 'signed' | 'pending' | 'expired';
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
  agreements?: Agreement;
};