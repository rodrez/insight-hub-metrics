export type SPI = {
  id: string;
  name: string;
  deliverable: string;
  details?: string;
  expectedCompletionDate: string;
  status: 'on-track' | 'delayed' | 'completed';
  projectId?: string;
  departmentId: string;
  smePartnerId?: string;
  fortune30PartnerId?: string;
  sitrepIds: string[];
  createdAt: string;
  ratMember?: string;
};