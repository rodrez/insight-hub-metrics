export type CollaborationType = 'fortune30' | 'sme' | 'internal';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  projects?: Array<{ id: string; name: string; description?: string }>;
  lastActive: string;
  type: CollaborationType;
  color?: string;
  primaryContact?: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  workstreams?: Array<{
    id: string;
    name: string;
    status: 'active' | 'completed' | 'on-hold';
    description?: string;
  }>;
  agreements?: Array<{
    id: string;
    name: string;
    status: 'draft' | 'pending' | 'active' | 'expired';
    expirationDate: string;
  }>;
  ratMember: string;
}