import { Collaborator } from '@/lib/types/collaboration';

const fortune30Companies = [
  { name: 'Apple', department: 'Technology' },
  { name: 'Microsoft', department: 'Software' },
  { name: 'Amazon', department: 'Cloud Services' },
  { name: 'Alphabet', department: 'Technology' },
  { name: 'Meta', department: 'Software' },
  { name: 'Tesla', department: 'Automotive' }
];

export const generateFortune30Partners = (): Collaborator[] => {
  return fortune30Companies.map((company, index) => ({
    id: `fortune30-${index + 1}`,
    name: company.name,
    email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    role: 'Corporate Partner',
    department: company.department,
    type: 'fortune30',
    lastActive: new Date().toISOString(),
    projects: []
  }));
};