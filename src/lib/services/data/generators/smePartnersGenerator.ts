import { Collaborator } from '@/lib/types/collaboration';
import { smeCompanies } from '../companies';

export const generateSMEPartners = (): Collaborator[] => {
  return smeCompanies.map((company, index) => ({
    id: `sme-${index + 1}`,
    name: company.name,
    color: company.color,
    email: `info@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    role: "SME Partner",
    department: company.department,
    ratMember: company.ratMember,
    projects: [
      {
        id: `${company.department.toLowerCase()}-${index + 1}`,
        name: `${company.department} Implementation`,
        description: `Advanced ${company.department.toLowerCase()} project focusing on enterprise solutions`,
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "sme" as const,
    agreements: {
      nda: {
        signedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'signed'
      }
    }
  }));
};