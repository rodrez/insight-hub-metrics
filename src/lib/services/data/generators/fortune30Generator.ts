import { Collaborator } from '@/lib/types/collaboration';

const fortune30Companies = [
  { 
    name: "Walmart",
    color: "#0071CE",
    department: "Retail",
    agreementTypes: ["nda", "jtda"]
  },
  { 
    name: "Amazon",
    color: "#FF9900",
    department: "Technology",
    agreementTypes: ["nda"]
  },
  { 
    name: "Apple",
    color: "#555555",
    department: "Technology",
    agreementTypes: ["jtda"]
  },
  { 
    name: "CVS Health",
    color: "#CC0000",
    department: "Healthcare",
    agreementTypes: ["nda", "jtda"]
  },
  { 
    name: "UnitedHealth",
    color: "#002677",
    department: "Healthcare",
    agreementTypes: ["jtda"]
  },
  { 
    name: "Microsoft",
    color: "#00A4EF",
    department: "Technology",
    agreementTypes: ["nda", "jtda"]
  }
];

export const generateFortune30Partners = (): Collaborator[] => {
  const today = new Date();
  
  return fortune30Companies.map((company, index) => {
    const agreements: { nda?: any; jtda?: any } = {};
    
    if (company.agreementTypes.includes('nda')) {
      agreements.nda = {
        signedDate: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + (275 * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'signed'
      };
    }
    
    if (company.agreementTypes.includes('jtda')) {
      agreements.jtda = {
        signedDate: new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + (305 * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'signed'
      };
    }

    return {
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
      workstreams: [
        {
          id: `ws-${index + 1}`,
          title: `${company.department} Innovation Stream`,
          objectives: `Drive innovation in ${company.department.toLowerCase()} through strategic collaboration`,
          nextSteps: "Complete phase 1 implementation and review results",
          keyContacts: [
            {
              name: "John Smith",
              role: "Project Lead",
              email: "john.smith@company.com",
              phone: "+1 (555) 123-4567"
            }
          ],
          status: "active",
          startDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          lastUpdated: today.toISOString()
        }
      ],
      lastActive: today.toISOString(),
      type: "fortune30",
      agreements
    };
  });
};