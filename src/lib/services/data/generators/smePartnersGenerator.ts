import { Collaborator } from '@/lib/types/collaboration';
import { RAT_MEMBERS } from '../utils/ratMemberUtils';

const smeCompanies = [
  {
    name: "InnoTech Solutions",
    color: "#4A90E2",
    role: "Software Development",
    department: "Technology",
    expertise: "Custom Software Solutions",
    ratMembers: ["Sarah Johnson", "James Wilson"]
  },
  {
    name: "DataFlow Analytics",
    color: "#50C878",
    role: "Data Analytics",
    department: "Analytics",
    expertise: "Business Intelligence",
    ratMembers: ["Sarah Johnson", "James Wilson", "Maria Garcia"]
  },
  {
    name: "CloudScale Systems",
    color: "#9B59B6",
    role: "Cloud Services",
    department: "Infrastructure",
    expertise: "Cloud Migration",
    ratMembers: ["Michael Chen", "Robert Taylor"]
  },
  {
    name: "SecureNet Solutions",
    color: "#E67E22",
    role: "Cybersecurity",
    department: "Security",
    expertise: "Network Security",
    ratMembers: ["David Kim", "Robert Taylor"]
  },
  {
    name: "AgileWorks Consulting",
    color: "#E74C3C",
    role: "Project Management",
    department: "Consulting",
    expertise: "Agile Transformation",
    ratMembers: ["Emily Rodriguez"]
  }
];

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  
  return smeCompanies.map((company, index) => {
    const primaryRatMember = company.ratMembers[0];
    const ratMemberInfo = RAT_MEMBERS[primaryRatMember];

    return {
      id: `sme-${index + 1}`,
      name: company.name,
      color: company.color,
      email: `info@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: company.role,
      department: company.department,
      ratMember: primaryRatMember,
      projects: [
        {
          id: `${company.department.toLowerCase()}-${index + 1}`,
          name: `${company.expertise} Implementation`,
          description: `Advanced ${company.expertise.toLowerCase()} project focusing on enterprise solutions`,
          status: "active"
        }
      ],
      workstreams: [
        {
          id: `sme-ws-${index + 1}`,
          title: `${company.expertise} Development`,
          objectives: `Implement ${company.expertise.toLowerCase()} solutions`,
          nextSteps: "Complete initial assessment and planning",
          keyContacts: [
            {
              name: ratMemberInfo?.name || "Project Lead",
              role: ratMemberInfo?.role || "Technical Lead",
              email: `${ratMemberInfo?.name.toLowerCase().replace(/\s+/g, '.')}@company.com` || "lead@company.com"
            }
          ],
          status: "active",
          startDate: new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
          lastUpdated: today.toISOString(),
          ratMember: primaryRatMember
        }
      ],
      lastActive: today.toISOString(),
      type: "sme",
      agreements: {
        nda: {
          signedDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          expiryDate: new Date(today.getTime() + (335 * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'signed'
        }
      }
    };
  });
};