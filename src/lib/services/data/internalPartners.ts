import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";

const generateInternalPartner = (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string
): Collaborator => {
  const department = DEPARTMENTS.find(d => d.id === departmentId);
  if (!department) {
    throw new Error(`Department ${departmentId} not found`);
  }
  
  return {
    id: `${departmentId}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    role,
    department: departmentId,
    projects: [],
    lastActive: new Date().toISOString(),
    type: "other",
    color: department.color
  };
};

export const generateInternalPartners = (): Collaborator[] => {
  const partners: Collaborator[] = [];
  
  // Generate 2-3 partners for each department
  DEPARTMENTS.forEach(dept => {
    const firstNames = ['Sarah', 'Michael', 'David', 'Emily', 'James', 'Lisa', 'Robert', 'Maria', 'John', 'Amanda', 'Thomas', 'Rachel'];
    const lastNames = ['Johnson', 'Chen', 'Rodriguez', 'Thompson', 'Wilson', 'Anderson', 'Kim', 'Garcia', 'Smith', 'Lee', 'Brown', 'Martinez'];
    const roles = ['Project Manager', 'Technical Lead', 'Senior Engineer', 'Program Director', 'Department Head'];
    
    // Generate 2-3 partners per department
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      
      partners.push(generateInternalPartner(firstName, lastName, dept.id, role));
    }
  });

  return partners;
};