import { Collaborator } from "@/lib/types";
import { generateId } from "../utils/dataGenerationUtils";
import { DEPARTMENTS } from "@/lib/constants";

export function generateInternalPartner(
  name: string,
  email: string,
  role: string,
  department: string
): Collaborator {
  return {
    id: generateId(),
    name,
    email,
    role,
    department,
    type: 'internal',
    projects: [],
    lastActive: new Date().toISOString(),
    ratMember: name // Using the partner's name as their RAT member designation for internal partners
  };
}

export function generateInternalPartners(): Collaborator[] {
  const partners: Collaborator[] = [];
  
  DEPARTMENTS.forEach((dept, index) => {
    partners.push(generateInternalPartner(
      `${dept.name} Lead`,
      `${dept.id}.lead@company.com`,
      'Department Lead',
      dept.id
    ));
  });

  return partners;
}