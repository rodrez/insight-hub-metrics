export type CollaborationType = 'NDA' | 'JTDA' | 'Both' | 'None';

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects: string[];
  lastActive: string;
  type?: 'fortune30' | 'other';
  agreements?: {
    type: CollaborationType;
    signedDate?: string;
    expiryDate?: string;
    details?: string;
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