export type CollaborationType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Agreement = {
  status: 'signed' | 'pending' | 'expired';
  signedDate?: string;
  expiryDate?: string;
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

export type CollaborationDetails = {
  projectId: string;
  projectName: string;
  status: string;
  agreementType: CollaborationType;
  signedDate?: string;
  expiryDate?: string;
  details: string;
};