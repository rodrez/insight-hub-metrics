import { Collaborator } from '@/lib/types/collaboration';
import { RAT_MEMBERS } from '../utils/ratMemberUtils';

const fortune30Companies = [
  { 
    name: "Walmart",
    color: "#0071CE",
    department: "Retail",
    ratMember: "Sarah Johnson",
    agreementTypes: ["nda", "jtda"]
  },
  { 
    name: "Amazon",
    color: "#FF9900",
    department: "Technology",
    ratMember: "Michael Chen",
    agreementTypes: ["nda"]
  },
  { 
    name: "Apple",
    color: "#555555",
    department: "Technology",
    ratMember: "Emily Rodriguez",
    agreementTypes: ["jtda"]
  },
  { 
    name: "CVS Health",
    color: "#CC0000",
    department: "Healthcare",
    ratMember: "David Kim",
    agreementTypes: ["nda", "jtda"]
  },
  { 
    name: "UnitedHealth",
    color: "#002677",
    department: "Healthcare",
    ratMember: "James Wilson",
    agreementTypes: ["jtda"]
  },
  { 
    name: "Microsoft",
    color: "#00A4EF",
    department: "Technology",
    ratMember: "Maria Garcia",
    agreementTypes: ["nda", "jtda"]
  }
];

export const generateFortune30Partners = (): Collaborator[] => {
  const today = new Date();
  
  return fortune30Companies.map((company) => {
    const agreements: { nda?: any; jtda?: any } = {};
    const ratMemberInfo = RAT_MEMBERS[company.ratMember];
    
    if (company.agreementTypes.includes('nda')) {
      agreements.nda = {
        signedDate: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'signed'
      };
    }
    
    if (company.agreementTypes.includes('jtda')) {
      agreements.jtda = {
        signedDate: new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString(),
        expiryDate: new Date(today.getTime() + 305 * 24 * 60 * 60 * 1000).toISOString(),
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
      ratMember: company.ratMember,
      projects: [
        {
          id: `${company.department.toLowerCase()}-project-1`,
          name: `${company.department} Innovation Project`,
          description: `Strategic partnership focusing on ${company.department.toLowerCase()} innovation and digital transformation.`,
          status: "active"
        }
      ],
      workstreams: [
        {
          id: `ws-${company.name.toLowerCase()}`,
          title: `${company.department} Innovation Stream`,
          objectives: `Drive innovation in ${company.department.toLowerCase()} through strategic collaboration`,
          nextSteps: "Complete phase 1 implementation and review results",
          keyContacts: [
            {
              name: ratMemberInfo?.name || "Project Lead",
              role: ratMemberInfo?.role || "Technical Lead",
              email: `${ratMemberInfo?.name.toLowerCase().replace(/\s+/g, '.')}@company.com` || "lead@company.com"
            }
          ],
          status: "active",
          startDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          lastUpdated: today.toISOString(),
          ratMember: company.ratMember
        }
      ],
      lastActive: today.toISOString(),
      type: "fortune30",
      agreements
    };
  });
};