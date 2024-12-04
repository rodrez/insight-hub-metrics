import { Collaborator } from '@/lib/types/collaboration';
import { RAT_MEMBERS } from '../utils/ratMemberUtils';

const smeCompanies = [
  {
    name: "TechStart Solutions",
    department: "Software Development",
    ratMember: "David Kim"
  },
  {
    name: "DataViz Analytics",
    department: "Analytics",
    ratMember: "Maria Garcia"
  },
  {
    name: "CloudNet Systems",
    department: "Infrastructure",
    ratMember: "Robert Taylor"
  },
  {
    name: "AI Dynamics",
    department: "AI/ML",
    ratMember: "James Wilson"
  },
  {
    name: "InnoTech Research",
    department: "R&D",
    ratMember: "Emily Rodriguez"
  }
];

export const generateSMEPartners = (): Collaborator[] => {
  const today = new Date();
  
  return smeCompanies.map((company) => {
    const ratMemberInfo = RAT_MEMBERS[company.ratMember];
    
    return {
      id: company.name.toLowerCase().replace(/\s+/g, ''),
      name: company.name,
      email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: "SME Partner",
      department: company.department,
      ratMember: company.ratMember,
      type: "sme" as const,
      lastActive: today.toISOString(),
      color: '#6E59A5',
      projects: [
        {
          id: `${company.department.toLowerCase().replace(/\s+/g, '-')}-1`,
          name: `${company.department} Innovation Project`,
          description: `Advanced research and development in ${company.department}`,
          status: 'active' as const
        }
      ]
    };
  });
};