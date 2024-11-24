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
  
  // Create initial partners with specific departments
  const initialPartners = [
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      departmentId: 'airplanes',
      role: 'Project Manager'
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      departmentId: 'space',
      role: 'Technical Lead'
    },
    {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      departmentId: 'energy',
      role: 'Program Director'
    }
  ];

  for (const partner of initialPartners) {
    partners.push(await generateInternalPartner(
      partner.firstName,
      partner.lastName,
      partner.departmentId,
      partner.role
    ));
  }

  // Generate additional partners for remaining departments
  for (const dept of DEPARTMENTS) {
    if (!partners.some(p => p.department === dept.id)) {
      const randomNames = {
        first: ['James', 'Maria', 'David', 'Lisa'][Math.floor(Math.random() * 4)],
        last: ['Wilson', 'Garcia', 'Kim', 'Anderson'][Math.floor(Math.random() * 4)]
      };
      
      partners.push(await generateInternalPartner(
        randomNames.first,
        randomNames.last,
        dept.id,
        ['Senior Engineer', 'Department Head', 'Technical Specialist'][Math.floor(Math.random() * 3)]
      ));
    }
  }

  return partners;
};