import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";

const generateInternalPartner = (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string,
  projects: Array<{id: string; name: string; description: string; status: 'active' | 'completed' | 'delayed' | 'action-needed'}>
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
    projects,
    lastActive: new Date().toISOString(),
    type: "other",
    color: department.color
  };
};

export const generateInternalPartners = (): Collaborator[] => {
  const partners: Collaborator[] = [
    generateInternalPartner(
      'Sarah',
      'Johnson',
      'airplanes',
      'Project Manager',
      [
        {
          id: 'airplane-innovation-1',
          name: 'Airplanes Innovation Project 1',
          description: 'Advanced aerodynamics research for next-gen aircraft',
          status: 'active'
        },
        {
          id: 'airplane-innovation-2',
          name: 'Airplanes Innovation Project 2',
          description: 'Developing fuel-efficient engine technologies',
          status: 'completed'
        }
      ]
    ),
    generateInternalPartner(
      'Michael',
      'Chen',
      'space',
      'Technical Lead',
      [
        {
          id: 'space-innovation-1',
          name: 'Space Innovation Project 1',
          description: 'Next-generation satellite communication systems',
          status: 'active'
        },
        {
          id: 'space-innovation-2',
          name: 'Space Innovation Project 2',
          description: 'Research on new propulsion technologies',
          status: 'delayed'
        }
      ]
    ),
    generateInternalPartner(
      'Emily',
      'Rodriguez',
      'energy',
      'Program Director',
      [
        {
          id: 'energy-innovation-1',
          name: 'Energy Innovation Project 1',
          description: 'Advanced energy systems development',
          status: 'action-needed'
        }
      ]
    )
  ];

  // Generate additional partners for each department
  DEPARTMENTS.forEach(dept => {
    if (!partners.some(p => p.department === dept.id)) {
      partners.push(
        generateInternalPartner(
          ['James', 'Maria', 'David', 'Lisa'][Math.floor(Math.random() * 4)],
          ['Wilson', 'Garcia', 'Kim', 'Anderson'][Math.floor(Math.random() * 4)],
          dept.id,
          ['Senior Engineer', 'Department Head', 'Technical Specialist'][Math.floor(Math.random() * 3)],
          [
            {
              id: `${dept.id}-innovation-1`,
              name: `${dept.name} Innovation Project 1`,
              description: `Key innovation project for ${dept.name}`,
              status: ['active', 'delayed', 'completed'][Math.floor(Math.random() * 3)] as 'active' | 'delayed' | 'completed'
            }
          ]
        )
      );
    }
  });

  return partners;
};