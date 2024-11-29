import { Collaborator } from '@/lib/types/collaboration';
import { DEPARTMENTS } from '@/lib/constants';

export const generateInternalPartners = async (): Promise<Collaborator[]> => {
  const partners: Collaborator[] = [];
  
  DEPARTMENTS.forEach((dept, index) => {
    partners.push({
      id: `internal-${dept.id}-${index}`,
      name: `${dept.name} Lead`,
      email: `${dept.id}.lead@company.com`,
      role: 'Department Lead',
      department: dept.id,
      type: 'other',
      lastActive: new Date().toISOString(),
      projects: []
    });
  });

  return partners;
};