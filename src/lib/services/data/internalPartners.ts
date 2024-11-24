import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";

const generateInternalPartner = (
  firstName: string,
  lastName: string,
  departmentId: string,
  role: string,
  projects: Array<{id: string; name: string; description: string; status: string}>
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
          id: 'wing-design',
          name: 'Wing Design Optimization',
          description: 'Advanced aerodynamics research for next-gen aircraft',
          status: 'active'
        },
        {
          id: 'fuel-efficiency',
          name: 'Fuel Efficiency Program',
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
          id: 'satellite-comm',
          name: 'Satellite Communications',
          description: 'Next-generation satellite communication systems',
          status: 'active'
        },
        {
          id: 'propulsion',
          name: 'Advanced Propulsion',
          description: 'Research on new propulsion technologies',
          status: 'delayed'
        }
      ]
    ),
    generateInternalPartner(
      'Emily',
      'Rodriguez',
      'defense',
      'Program Director',
      [
        {
          id: 'cyber-defense',
          name: 'Cyber Defense Initiative',
          description: 'Advanced cybersecurity systems development',
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
              id: `${dept.id}-project-1`,
              name: `${dept.name} Innovation`,
              description: `Key innovation project for ${dept.name}`,
              status: ['active', 'delayed', 'completed'][Math.floor(Math.random() * 3)]
            }
          ]
        )
      );
    }
  });

  return partners;
};