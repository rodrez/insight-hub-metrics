import { Collaborator } from '@/lib/types/collaboration';

const fortune30Companies = [
  { 
    name: "Walmart",
    color: "#0071CE",
    department: "Retail"
  },
  { 
    name: "Amazon",
    color: "#FF9900",
    department: "Technology"
  },
  { 
    name: "Apple",
    color: "#555555",
    department: "Technology"
  },
  { 
    name: "CVS Health",
    color: "#CC0000",
    department: "Healthcare"
  },
  { 
    name: "UnitedHealth",
    color: "#002677",
    department: "Healthcare"
  },
  { 
    name: "ExxonMobil",
    color: "#ED1C24",
    department: "Energy"
  },
  { 
    name: "Microsoft",
    color: "#00A4EF",
    department: "Technology"
  },
  { 
    name: "Google",
    color: "#4285F4",
    department: "Technology"
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
    projects: [
      {
        id: `${company.department.toLowerCase()}-project-${index + 1}`,
        name: `${company.department} Innovation Project ${index + 1}`,
        description: `Strategic partnership focusing on ${company.department.toLowerCase()} innovation and digital transformation.`,
        status: "active"
      }
    ],
    lastActive: today.toISOString(),
    type: "fortune30",
    agreements: {
      nda: {
        signedDate: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + (275 * 24 * 60 * 60 * 1000)).toISOString(),
        status: "signed"
      }
    }
  }));
};