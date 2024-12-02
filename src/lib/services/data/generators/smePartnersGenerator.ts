import { Collaborator } from '@/lib/types/collaboration';

export const generateSMEPartners = (): Collaborator[] => {
  return smeCompanies.map((company, index) => ({
    id: `sme-${index + 1}`,
    name: company.name,
    color: company.color,
    email: `info@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    role: company.role,
    department: company.department,
    projects: [
      {
        id: `${company.department.toLowerCase()}-${index + 1}`,
        name: `${company.expertise} Implementation`,
        description: `Advanced ${company.expertise.toLowerCase()} project focusing on enterprise solutions`,
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "sme",
    ratMember: `SME RAT Member ${index + 1}`,
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'signed'
      }
    }
  }));
};