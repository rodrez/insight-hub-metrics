import { Collaborator } from "@/lib/types/collaboration";
import { fortune30Companies } from "./companies";

export const generateFortune30Partners = (): Collaborator[] => {
  return fortune30Companies.map(company => ({
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
        name: `${company.department} Innovation Project 1`,
        description: "Strategic innovation project",
        status: "active"
      }
    ],
    lastActive: new Date().toISOString(),
    type: "fortune30" as const,
    agreements: company.agreementTypes.reduce((acc, type) => ({
      ...acc,
      [type]: {
        signedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'signed'
      }
    }), {})
  }));
};

export const fortune30Partners = generateFortune30Partners();