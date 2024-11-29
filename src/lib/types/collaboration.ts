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
};

export type CollaborationType = 'fortune30' | 'other' | 'sme';