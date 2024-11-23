import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { generateEmployeeData, InternalEmployee } from './employeeDataGenerator';

export const generateProjectData = (departments: Department[], techDomains: TechDomain[]) => {
  const projects: Project[] = [];
  const internalEmployees = generateEmployeeData(departments);
  const startDate = new Date();

  departments.forEach((dept) => {
    const projectCount = dept.projectCount;
    
    for (let i = 0; i < projectCount; i++) {
      const deptEmployees = internalEmployees.filter(emp => emp.department.id === dept.id);
      const pocEmployee = deptEmployees[0] || internalEmployees[0];
      const techLeadEmployee = deptEmployees[1] || internalEmployees[1];

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
          projects: [],
          lastActive: new Date().toISOString(),
          type: 'other' as const
        }));

      const budget = Math.round(dept.budget / projectCount);
      const spent = Math.round(budget * (Math.random() * 0.8));

      // Assign a random tech domain
      const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];

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
        collaborators: [],
        internalPartners: selectedPartners,
        techDomainId: randomTechDomain.id,
        nabc: generateNABC(dept.name),
        milestones: generateMilestones(`${dept.id}-project-${i + 1}`, startDate),
        metrics: generateMetrics(`${dept.id}-project-${i + 1}`),
        isSampleData: true
      };

      projects.push(project);
    }
  });

  return { projects, internalEmployees };
};

const generateNABC = (deptName: string) => ({
  needs: `Developing next-generation ${deptName.toLowerCase()} systems with improved efficiency and reduced environmental impact.`,
  approach: "Implementing advanced technologies and innovative solutions, combined with AI-driven optimization algorithms for maximum performance.",
  benefits: "20% reduction in operational costs, 15% decrease in maintenance costs, and potential market leadership in eco-friendly solutions.",
  competition: "Major competitors are investing in similar technologies, but our integrated approach provides a significant advantage in time-to-market."
});

const generateMilestones = (projectId: string, startDate: Date) => [
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

const generateMetrics = (projectId: string) => [
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