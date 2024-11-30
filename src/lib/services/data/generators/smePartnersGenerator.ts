import { Collaborator } from '@/lib/types/collaboration';

const smeCompanies = [
  {
    name: "InnoTech Solutions",
    color: "#4A90E2",
    role: "Software Development",
    department: "Technology",
    expertise: "Custom Software Solutions",
    description: "Specializing in enterprise software development and digital transformation",
    contact: {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      email: "sarah.chen@innotech.com",
      phone: "+1 (555) 123-4567"
    }
  },
  {
    name: "DataFlow Analytics",
    color: "#50C878",
    role: "Data Analytics",
    department: "Analytics",
    expertise: "Business Intelligence",
    description: "Advanced analytics and machine learning solutions provider",
    contact: {
      name: "Michael Zhang",
      role: "Analytics Director",
      email: "m.zhang@dataflow.com",
      phone: "+1 (555) 234-5678"
    }
  },
  {
    name: "CloudScale Systems",
    color: "#9B59B6",
    role: "Cloud Services",
    department: "Infrastructure",
    expertise: "Cloud Migration",
    description: "Cloud infrastructure and scalability experts",
    contact: {
      name: "Emily Rodriguez",
      role: "Cloud Architect",
      email: "e.rodriguez@cloudscale.com",
      phone: "+1 (555) 345-6789"
    }
  },
  {
    name: "SecureNet Solutions",
    color: "#E67E22",
    role: "Cybersecurity",
    department: "Security",
    expertise: "Network Security",
    description: "Enterprise cybersecurity and threat prevention",
    contact: {
      name: "James Wilson",
      role: "Security Director",
      email: "j.wilson@securenet.com",
      phone: "+1 (555) 456-7890"
    }
  },
  {
    name: "AgileWorks Consulting",
    color: "#E74C3C",
    role: "Project Management",
    department: "Consulting",
    expertise: "Agile Transformation",
    description: "Agile methodology implementation and team optimization",
    contact: {
      name: "Lisa Park",
      role: "Transformation Lead",
      email: "l.park@agileworks.com",
      phone: "+1 (555) 567-8901"
    }
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
    description: company.description,
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
        id: `ws-sme-${index + 1}`,
        title: `${company.expertise} Development`,
        objectives: `Implement cutting-edge ${company.expertise.toLowerCase()} solutions`,
        nextSteps: "Complete current phase milestones and review progress",
        keyContacts: [
          {
            name: company.contact.name,
            role: company.contact.role,
            email: company.contact.email,
            phone: company.contact.phone
          }
        ],
        status: "active",
        startDate: new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
        lastUpdated: today.toISOString()
      }
    ],
    lastActive: today.toISOString(),
    type: "sme",
    primaryContact: company.contact,
    agreements: {
      nda: {
        signedDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + (335 * 24 * 60 * 60 * 1000)).toISOString(),
        status: "signed"
      }
    }
  }));
};