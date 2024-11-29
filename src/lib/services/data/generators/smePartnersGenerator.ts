import { Collaborator } from '@/lib/types/collaboration';

const smeAreas = [
  { name: 'AI/ML', department: 'Technology' },
  { name: 'Cloud Architecture', department: 'Infrastructure' },
  { name: 'Cybersecurity', department: 'Security' },
  { name: 'Data Science', department: 'Analytics' },
  { name: 'DevOps', department: 'Operations' },
  { name: 'Blockchain', department: 'Technology' }
];

export const generateSMEPartners = (): Collaborator[] => {
  return smeAreas.map((area, index) => ({
    id: `sme-${index + 1}`,
    name: `${area.name} Expert`,
    email: `sme.${area.name.toLowerCase().replace(/\s+/g, '')}@company.com`,
    role: 'Subject Matter Expert',
    department: area.department,
    type: 'sme',
    lastActive: new Date().toISOString(),
    projects: []
  }));
};