import { Collaborator } from '@/lib/types/collaboration';

const smeCompanies = [
  {
    name: "InnoTech Solutions",
    color: "#4A90E2",
    role: "Software Development",
    department: "Technology",
    expertise: "Custom Software Solutions"
  },
  {
    name: "DataFlow Analytics",
    color: "#50C878",
    role: "Data Analytics",
    department: "Analytics",
    expertise: "Business Intelligence"
  },
  {
    name: "CloudScale Systems",
    color: "#9B59B6",
    role: "Cloud Services",
    department: "Infrastructure",
    expertise: "Cloud Migration"
  },
  {
    name: "SecureNet Solutions",
    color: "#E67E22",
    role: "Cybersecurity",
    department: "Security",
    expertise: "Network Security"
  },
  {
    name: "AgileWorks Consulting",
    color: "#E74C3C",
    role: "Project Management",
    department: "Consulting",
    expertise: "Agile Transformation"
  }
];

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  
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
    workstreams: [
      {
        id: `sme-ws-${index + 1}`,
        title: `${company.expertise} Development`,
        objectives: `Implement ${company.expertise.toLowerCase()} solutions`,
        nextSteps: "Complete initial assessment and planning",
        keyContacts: [
          {
            name: "Project Lead",
            role: "Technical Lead",
            email: `lead@${company.name.toLowerCase().replace(/\s+/g, '')}.com`
          }
        ],
        status: "active",
        startDate: new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
        lastUpdated: today.toISOString()
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
  }));
};