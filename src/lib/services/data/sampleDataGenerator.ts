import { Project, Department, Collaborator } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';

// Enhanced internal partner type
interface InternalEmployee {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  projects: string[];
}

// Sample internal employees data
const internalEmployees: InternalEmployee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Johnson',
    role: 'Senior Project Manager',
    department: DEPARTMENTS[0], // Airplanes
    email: 'sarah.johnson@company.com',
    projects: []
  },
  {
    id: 'emp-2',
    name: 'Michael Chen',
    role: 'Technical Architect',
    department: DEPARTMENTS[1], // Helicopters
    email: 'michael.chen@company.com',
    projects: []
  },
  {
    id: 'emp-3',
    name: 'David Rodriguez',
    role: 'Systems Engineer',
    department: DEPARTMENTS[2], // Space
    email: 'david.rodriguez@company.com',
    projects: []
  },
  {
    id: 'emp-4',
    name: 'Emily Thompson',
    role: 'Program Director',
    department: DEPARTMENTS[3], // Energy
    email: 'emily.thompson@company.com',
    projects: []
  },
  {
    id: 'emp-5',
    name: 'James Wilson',
    role: 'IT Lead',
    department: DEPARTMENTS[4], // IT
    email: 'james.wilson@company.com',
    projects: []
  },
  {
    id: 'emp-6',
    name: 'Lisa Anderson',
    role: 'Research Lead',
    department: DEPARTMENTS[5], // Tech Lab
    email: 'lisa.anderson@company.com',
    projects: []
  }
];

// Project descriptions for more realistic data
const projectDescriptions = [
  {
    needs: "Developing next-generation aircraft systems with improved fuel efficiency and reduced environmental impact. This initiative aims to meet growing market demands while adhering to stricter environmental regulations.",
    approach: "Implementing advanced composite materials and innovative propulsion systems, combined with AI-driven optimization algorithms for maximum performance.",
    benefits: "20% reduction in fuel consumption, 15% decrease in maintenance costs, and potential market leadership in eco-friendly aviation solutions.",
    competition: "Major competitors are investing in similar technologies, but our integrated approach provides a 2-year advantage in time-to-market."
  },
  {
    needs: "Revolutionizing urban air mobility through development of autonomous VTOL systems. Meeting increasing demand for efficient urban transportation solutions.",
    approach: "Combining advanced autonomous systems with electric propulsion technology, supported by a comprehensive ground infrastructure network.",
    benefits: "Creation of new market segment worth $5B annually, reduced urban congestion, and establishment of industry standards.",
    competition: "Several startups and established manufacturers are developing similar concepts, but lack our integrated ecosystem approach."
  }
];

// Generate realistic milestones for projects
const generateMilestones = (projectId: string, startDate: Date) => {
  const milestones = [
    {
      id: `${projectId}-m1`,
      title: "Requirements & Planning",
      description: "Define technical specifications and project scope",
      dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const,
      progress: 100
    },
    {
      id: `${projectId}-m2`,
      title: "Design Phase",
      description: "Complete system architecture and detailed design",
      dueDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: "in-progress" as const,
      progress: 65
    },
    {
      id: `${projectId}-m3`,
      title: "Implementation",
      description: "Development and integration of core systems",
      dueDate: new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
      progress: 0
    }
  ];
  return milestones;
};

// Generate realistic metrics for projects
const generateMetrics = (projectId: string) => {
  return [
    {
      id: `${projectId}-metric-1`,
      name: "Development Progress",
      value: Math.round(Math.random() * 100),
      target: 100,
      unit: "%",
      trend: "up" as const,
      description: "Overall project completion status"
    },
    {
      id: `${projectId}-metric-2`,
      name: "Budget Utilization",
      value: Math.round(Math.random() * 95),
      target: 100,
      unit: "%",
      trend: "stable" as const,
      description: "Current budget consumption vs allocation"
    },
    {
      id: `${projectId}-metric-3`,
      name: "Resource Efficiency",
      value: Math.round(Math.random() * 90 + 10),
      target: 95,
      unit: "%",
      trend: "up" as const,
      description: "Team productivity and resource utilization"
    }
  ];
};

export const generateSampleData = () => {
  const projects: Project[] = [];
  const startDate = new Date();

  DEPARTMENTS.forEach((dept, deptIndex) => {
    const projectCount = dept.projectCount;
    
    for (let i = 0; i < projectCount; i++) {
      // Assign POC and Tech Lead from matching department
      const deptEmployees = internalEmployees.filter(emp => emp.department.id === dept.id);
      const pocEmployee = deptEmployees[0] || internalEmployees[0];
      const techLeadEmployee = deptEmployees[1] || internalEmployees[1];

      // Select random internal partners (2-5)
      const partnerCount = Math.floor(Math.random() * 4) + 2;
      const availablePartners = internalEmployees.filter(emp => 
        emp.id !== pocEmployee.id && emp.id !== techLeadEmployee.id
      );
      const selectedPartners = availablePartners
        .sort(() => Math.random() - 0.5)
        .slice(0, partnerCount)
        .map(partner => ({
          id: partner.id,
          name: partner.name,
          email: partner.email,
          role: partner.role,
          department: partner.department.id,
          color: partner.department.color,
          projects: [], // Add empty projects array
          lastActive: new Date().toISOString(), // Add current date as lastActive
          type: 'other' as const // Add type as 'other' for internal partners
        }));

      const budget = Math.round(dept.budget / projectCount);
      const spent = Math.round(budget * (Math.random() * 0.8));

      const project: Project = {
        id: `${dept.id}-project-${i + 1}`,
        name: `${dept.name} Innovation Project ${i + 1}`,
        departmentId: dept.id,
        poc: pocEmployee.name,
        pocDepartment: pocEmployee.department.id,
        techLead: techLeadEmployee.name,
        techLeadDepartment: techLeadEmployee.department.id,
        budget,
        spent,
        status: "active",
        collaborators: [], // To be filled by fortune30 data
        internalPartners: selectedPartners,
        techDomainId: defaultTechDomains[Math.floor(Math.random() * defaultTechDomains.length)].id,
        nabc: projectDescriptions[i % projectDescriptions.length],
        milestones: generateMilestones(`${dept.id}-project-${i + 1}`, startDate),
        metrics: generateMetrics(`${dept.id}-project-${i + 1}`),
        isSampleData: true // Flag to identify sample data
      };

      projects.push(project);
    }
  });

  return {
    projects,
    internalEmployees
  };
};
