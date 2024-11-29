import { Collaborator } from '@/lib/types/collaboration';

const smeAreas = [
  'AI/ML', 'Cloud Architecture', 'Cybersecurity',
  'Data Science', 'DevOps', 'Blockchain'
];

export const generateSMEPartners = (): Collaborator[] => {
  return smeAreas.map((area, index) => ({
    id: `sme-${index + 1}`,
    name: `${area} Expert`,
    email: `sme.${area.toLowerCase().replace(/\s+/g, '')}@company.com`,
    role: 'Subject Matter Expert',
    type: 'sme',
    lastActive: new Date().toISOString(),
    projects: []
  }));
};