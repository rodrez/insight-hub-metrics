import { Collaborator } from '@/lib/types/collaboration';

const fortune30Companies = [
  'Apple', 'Microsoft', 'Amazon', 'Alphabet', 'Meta',
  'Tesla', 'Berkshire Hathaway', 'NVIDIA', 'JPMorgan Chase', 'Johnson & Johnson'
];

export const generateFortune30Partners = (): Collaborator[] => {
  return fortune30Companies.map((company, index) => ({
    id: `fortune30-${index + 1}`,
    name: company,
    email: `contact@${company.toLowerCase().replace(/\s+/g, '')}.com`,
    role: 'Corporate Partner',
    type: 'fortune30',
    lastActive: new Date().toISOString(),
    projects: []
  }));
};