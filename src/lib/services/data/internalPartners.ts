import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import { Project } from "@/lib/types";
import { db } from "@/lib/db";

const generateInternalPartner = async (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string
): Promise<Collaborator> => {
  const department = DEPARTMENTS.find(d => d.id === departmentId);
  if (!department) {
    throw new Error(`Department ${departmentId} not found`);
  }

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
    name: `${firstName} ${lastName}`,
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
  
  // Generate 4 partners for each department
  for (const dept of DEPARTMENTS) {
    const departmentPartners = [
      {
        firstName: ['Sarah', 'Michael', 'Emily', 'James'][0],
        lastName: ['Johnson', 'Chen', 'Rodriguez', 'Wilson'][0],
        role: ['Project Manager', 'Technical Lead', 'Senior Engineer', 'Department Head'][0]
      },
      {
        firstName: ['David', 'Lisa', 'Robert', 'Maria'][1],
        lastName: ['Smith', 'Park', 'Taylor', 'Garcia'][1],
        role: ['Systems Engineer', 'Research Lead', 'Technical Specialist', 'Program Director'][1]
      },
      {
        firstName: ['John', 'Amanda', 'Thomas', 'Rachel'][2],
        lastName: ['Brown', 'White', 'Lee', 'Martinez'][2],
        role: ['Innovation Lead', 'Development Manager', 'Integration Specialist', 'Operations Manager'][2]
      },
      {
        firstName: ['Daniel', 'Jennifer', 'William', 'Patricia'][3],
        lastName: ['Kim', 'Anderson', 'Davis', 'Thompson'][3],
        role: ['Technical Architect', 'Product Manager', 'Solutions Engineer', 'Team Lead'][3]
      }
    ];

    for (const partner of departmentPartners) {
      partners.push(await generateInternalPartner(
        partner.firstName,
        partner.lastName,
        dept.id,
        partner.role
      ));
    }
  }

  return partners;
};