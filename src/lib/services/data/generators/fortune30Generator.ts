import { Collaborator } from '@/lib/types/collaboration';

const fortune30Companies = [
  { 
    name: "Walmart",
    color: "#0071CE",
    department: "Retail",
    description: "Global retail leader focusing on digital transformation and supply chain innovation.",
    primaryContact: {
      name: "John Smith",
      role: "Director of Innovation",
      email: "john.smith@walmart.com",
      phone: "+1 (555) 123-4567"
    }
  },
  { 
    name: "Amazon",
    color: "#FF9900",
    department: "Technology",
    description: "E-commerce and cloud computing pioneer driving technological advancement.",
    primaryContact: {
      name: "Emily Chen",
      role: "Head of Strategic Partnerships",
      email: "emily.chen@amazon.com",
      phone: "+1 (555) 234-5678"
    }
  },
  { 
    name: "Apple",
    color: "#555555",
    department: "Technology",
    description: "Leading consumer technology company focused on innovation and user experience.",
    primaryContact: {
      name: "Michael Wong",
      role: "Partnership Director",
      email: "m.wong@apple.com",
      phone: "+1 (555) 345-6789"
    }
  },
  { 
    name: "CVS Health",
    color: "#CC0000",
    department: "Healthcare",
    description: "Healthcare innovation leader focusing on digital health solutions.",
    primaryContact: {
      name: "Sarah Johnson",
      role: "Innovation Lead",
      email: "s.johnson@cvs.com",
      phone: "+1 (555) 456-7890"
    }
  },
  { 
    name: "UnitedHealth",
    color: "#002677",
    department: "Healthcare",
    description: "Healthcare technology pioneer advancing digital health platforms.",
    primaryContact: {
      name: "David Park",
      role: "Technology Director",
      email: "d.park@unitedhealth.com",
      phone: "+1 (555) 567-8901"
    }
  },
  { 
    name: "Microsoft",
    color: "#00A4EF",
    department: "Technology",
    description: "Enterprise software leader driving cloud and AI innovation.",
    primaryContact: {
      name: "Lisa Garcia",
      role: "Strategic Partnerships",
      email: "l.garcia@microsoft.com",
      phone: "+1 (555) 678-9012"
    }
  }
];

export const generateFortune30Partners = (): Collaborator[] => {
  const today = new Date();
  
  return fortune30Companies.map((company, index) => ({
    id: company.name.toLowerCase().replace(/\s+/g, ''),
    name: company.name,
    color: company.color,
    email: `partnerships@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    role: "Strategic Partner",
    department: company.department,
    description: company.description,
    projects: [
      {
        id: `${company.department.toLowerCase()}-project-${index + 1}`,
        name: `${company.department} Innovation Project ${index + 1}`,
        description: `Strategic partnership focusing on ${company.department.toLowerCase()} innovation and digital transformation.`,
        status: "active"
      }
    ],
    workstreams: [
      {
        id: `ws-${index + 1}`,
        title: `${company.department} Innovation Stream`,
        objectives: `Drive innovation in ${company.department.toLowerCase()} through strategic collaboration`,
        nextSteps: "Complete phase 1 implementation and review results",
        keyContacts: [
          {
            name: company.primaryContact.name,
            role: company.primaryContact.role,
            email: company.primaryContact.email,
            phone: company.primaryContact.phone
          }
        ],
        status: "active",
        startDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
        lastUpdated: today.toISOString()
      }
    ],
    lastActive: today.toISOString(),
    type: "fortune30",
    primaryContact: company.primaryContact,
    agreements: {
      nda: {
        signedDate: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + (275 * 24 * 60 * 60 * 1000)).toISOString(),
        status: "signed"
      }
    }
  }));
};