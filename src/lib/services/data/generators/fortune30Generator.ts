import { Collaborator } from '@/lib/types/collaboration';

export const generateFortune30Partners = (): Collaborator[] => {
  return fortune30Companies.map((company, index) => ({
    id: company.name.toLowerCase().replace(/\s+/g, ''),
    name: company.name,
    color: company.color,
    email: `partnerships@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    role: "Strategic Partner",
    department: company.department,
    projects: [
      {
        id: `${company.department.toLowerCase()}-project-${index + 1}`,
        name: `${company.department} Innovation Project ${index + 1}`,
        description: `Strategic partnership focusing on ${company.department.toLowerCase()} innovation and digital transformation.`,
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30",
    ratMember: `RAT Member ${index + 1}`,
    agreements: company.agreementTypes.reduce((acc, type) => ({
      ...acc,
      [type]: {
        signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'signed'
      }
    }), {})
  }));
};