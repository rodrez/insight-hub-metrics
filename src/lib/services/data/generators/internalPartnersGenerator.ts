import { Collaborator } from "@/lib/types";
import { generateId } from "../utils/dataGenerationUtils";
import { DEPARTMENTS } from "@/lib/constants";

const firstNames = [
  'Sarah', 'Michael', 'Emily', 'James', 'David', 'Lisa', 'Robert', 'Maria',
  'John', 'Amanda', 'Thomas', 'Rachel', 'Daniel', 'Jennifer', 'William', 'Patricia',
  'Richard', 'Elizabeth', 'Joseph', 'Susan', 'Charles', 'Karen', 'Christopher', 'Nancy'
];

const lastNames = [
  'Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Smith', 'Park', 'Taylor', 'Garcia',
  'Brown', 'White', 'Lee', 'Martinez', 'Kim', 'Anderson', 'Davis', 'Thompson',
  'Miller', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'
];

const roles = [
  'Project Manager', 'Technical Lead', 'Senior Engineer', 'Department Head',
  'Systems Engineer', 'Research Lead', 'Technical Specialist', 'Program Director',
  'Innovation Lead', 'Strategy Director', 'Operations Manager', 'Development Lead'
];

export function generateInternalPartner(
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string
): Collaborator {
  return {
    id: generateId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    role,
    department: departmentId,
    type: 'internal',
    projects: [],
    lastActive: new Date().toISOString(),
  };
}

export function generateInternalPartners(): Collaborator[] {
  const partners: Collaborator[] = [];
  const usedNames = new Set<string>();
  
  // Generate more partners than needed to ensure we have enough unique ones
  const targetCount = 30; // Higher than max requested to ensure we have enough
  
  DEPARTMENTS.forEach((dept) => {
    for (let i = 0; i < Math.ceil(targetCount / DEPARTMENTS.length); i++) {
      let attempts = 0;
      const maxAttempts = 50;
      
      while (attempts < maxAttempts) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        
        if (!usedNames.has(fullName)) {
          usedNames.add(fullName);
          const role = roles[Math.floor(Math.random() * roles.length)];
          partners.push(generateInternalPartner(firstName, lastName, dept.id, role));
          break;
        }
        
        attempts++;
      }
    }
  });

  return partners;
}