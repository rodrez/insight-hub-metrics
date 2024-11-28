import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from '@/lib/constants';

const firstNames = [
  'Sarah', 'Michael', 'Emily', 'James', 'David', 'Lisa', 'Robert', 'Maria',
  'John', 'Amanda', 'Thomas', 'Rachel', 'Daniel', 'Jennifer', 'William'
];

const lastNames = [
  'Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Smith', 'Park', 'Taylor', 'Garcia',
  'Brown', 'White', 'Lee', 'Martinez', 'Kim', 'Anderson', 'Davis'
];

const roles = [
  'Project Manager', 'Technical Lead', 'Senior Engineer', 'Department Head',
  'Systems Engineer', 'Research Lead', 'Technical Specialist', 'Program Director'
];

const usedNames = new Set<string>();

const generateInternalPartner = (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string
): Collaborator | null => {
  const fullName = `${firstName} ${lastName}`;
  
  if (usedNames.has(fullName)) return null;

  const department = DEPARTMENTS.find(d => d.id === departmentId);
  if (!department) return null;

  usedNames.add(fullName);
  
  return {
    id: `${departmentId}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    role,
    department: departmentId,
    lastActive: new Date().toISOString(),
    type: "other",
    color: department.color,
    projects: [] // Add empty projects array to satisfy Collaborator type
  };
};

export const generateInternalPartners = (): Collaborator[] => {
  const partners: Collaborator[] = [];
  usedNames.clear();
  
  for (const dept of DEPARTMENTS) {
    let partnersAdded = 0;
    let attempts = 0;
    const maxAttempts = 50;

    while (partnersAdded < 4 && attempts < maxAttempts) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[partnersAdded % roles.length];

      const partner = generateInternalPartner(firstName, lastName, dept.id, role);
      
      if (partner) {
        partners.push(partner);
        partnersAdded++;
      }

      attempts++;
    }
  }

  return partners;
};