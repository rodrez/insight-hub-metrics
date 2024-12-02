export type SPI = {
  id: string;
  name: string;
  deliverable: string;
  details?: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'on-track' | 'delayed' | 'completed' | 'cancelled';
  projectId?: string;
  departmentId: string;
  fortune30PartnerId?: string;
  smePartnerId?: string;
  sitrepIds: string[];
  createdAt: string;
  ratMember: string;
};