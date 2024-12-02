export type SPIStatus = 'on-track' | 'delayed' | 'completed' | 'cancelled';

export interface SPI {
  id: string;
  name: string;
  deliverable: string;
  details: string;
  expectedCompletionDate: string;
  status: SPIStatus;
  projectId?: string;
  departmentId: string;
  sitrepIds: string[];
  createdAt: string;
  ratMember: string;
  smePartnerId?: string;
  fortune30PartnerId?: string;
}