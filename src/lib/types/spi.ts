export type SPI = {
  id: string;
  name: string;
  deliverable: string;
  details?: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'completed' | 'delayed' | 'on-track';
  projectId?: string;
  departmentId: string;
  smePartnerId?: string;
  sitrepIds: string[];
  createdAt: string;
};