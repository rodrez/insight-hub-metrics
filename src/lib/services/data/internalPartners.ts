import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import { Project } from "@/lib/types";
import { db } from "@/lib/db";

// Create a map of used names to prevent duplicates across departments
const usedNames = new Set<string>();

const generateInternalPartner = async (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string
): Promise<Collaborator | null> => {
  const fullName = `${firstName} ${lastName}`;
  
  // Check if name is already used
  if (usedNames.has(fullName)) {
    console.warn(`Name ${fullName} is already in use in another department`);
    return null;
  }

  const department = DEPARTMENTS.find(d => d.id === departmentId);
  if (!department) {
    throw new Error(`Department ${departmentId} not found`);
  }

  // Add name to used names set
  usedNames.add(fullName);

  // Get all projects for this department
  const allProjects = await db.getAllProjects();
  const departmentProjects = allProjects
    .filter(p => p.departmentId === departmentId)
    .map(p => ({
      id: p.id,
      name: p.name,
      description: p.nabc?.needs || "No description available",
      status: p.status
    }));
  
  return {
    id: `${departmentId}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    name: fullName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    role,
    department: departmentId,
    projects: departmentProjects,
    lastActive: new Date().toISOString(),
    type: "other",
    color: department.color
  };
};

export const generateInternalPartners = async (): Promise<Collaborator[]> => {
  await db.init();
  
  const partners: Collaborator[] = [];
  usedNames.clear(); // Clear the set before generating new partners
  
  // Define all possible names
  const firstNames = [
    'Sarah', 'Michael', 'Emily', 'James',
    'David', 'Lisa', 'Robert', 'Maria',
    'John', 'Amanda', 'Thomas', 'Rachel',
    'Daniel', 'Jennifer', 'William', 'Patricia',
    'Richard', 'Karen', 'Joseph', 'Nancy',
    'Charles', 'Betty', 'Christopher', 'Margaret',
    'Steven', 'Sandra', 'Kevin', 'Ashley',
    'Edward', 'Dorothy', 'Brian', 'Linda'
  ];

  const lastNames = [
    'Johnson', 'Chen', 'Rodriguez', 'Wilson',
    'Smith', 'Park', 'Taylor', 'Garcia',
    'Brown', 'White', 'Lee', 'Martinez',
    'Kim', 'Anderson', 'Davis', 'Thompson',
    'Miller', 'Moore', 'Martin', 'Jackson',
    'Thompson', 'White', 'Lopez', 'Lewis',
    'Clark', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott'
  ];

  const roles = [
    'Project Manager', 'Technical Lead', 'Senior Engineer', 'Department Head',
    'Systems Engineer', 'Research Lead', 'Technical Specialist', 'Program Director',
    'Innovation Lead', 'Development Manager', 'Integration Specialist', 'Operations Manager',
    'Technical Architect', 'Product Manager', 'Solutions Engineer', 'Team Lead'
  ];

  // Generate 4 unique partners for each department
  for (const dept of DEPARTMENTS) {
    let partnersAdded = 0;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops

    while (partnersAdded < 4 && attempts < maxAttempts) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[partnersAdded % roles.length]; // Ensure different roles

      const partner = await generateInternalPartner(firstName, lastName, dept.id, role);
      
      if (partner) {
        partners.push(partner);
        partnersAdded++;
      }

      attempts++;
    }

    if (partnersAdded < 4) {
      console.warn(`Could not generate 4 unique partners for department ${dept.id}`);
    }
  }

  return partners;
};