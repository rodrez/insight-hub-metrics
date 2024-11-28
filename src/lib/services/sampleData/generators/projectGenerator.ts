import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { defaultTechDomains } from '@/lib/types/techDomain';

const projectNames = [
  "Next-Gen AI Integration",
  "Sustainable Aviation",
  "Cloud Infrastructure Upgrade",
  "Quantum Computing Research",
  "Green Energy Initiative"
];

const generateNABC = (deptName: string, projectName: string) => ({
  needs: `Addressing critical business needs in ${deptName.toLowerCase()} through ${projectName.toLowerCase()} implementation.`,
  approach: "Implementing cutting-edge technologies and innovative solutions.",
  benefits: "20% reduction in operational costs, 15% decrease in maintenance costs.",
  competition: "Leading the industry with our integrated approach."
});

const generateMilestones = (projectId: string) => [
  {
    id: `${projectId}-m1`,
    title: "Requirements & Planning",
    description: "Define technical specifications and project scope",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
    progress: 100
  },
  {
    id: `${projectId}-m2`,
    title: "Implementation",
    description: "Development and integration of core systems",
    dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending" as const,
    progress: 0
  }
];

const generateMetrics = (projectId: string, spent: number, budget: number) => [
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
    value: Math.round((spent / budget) * 100),
    target: 100,
    unit: "%",
    trend: "stable" as const,
    description: "Current budget consumption vs allocation"
  }
];

export const generateProjects = (
  departments: Department[],
  internalPartners: Collaborator[],
  fortune30Partners: Collaborator[]
): Project[] => {
  const projects: Project[] = [];

  departments.forEach((dept, index) => {
    const deptPartners = internalPartners.filter(p => p.department === dept.id);
    if (deptPartners.length < 2) return;

    const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
    const spent = Math.round(budget * (0.2 + Math.random() * 0.5));

    const project: Project = {
      id: `${dept.id}-project-${index + 1}`,
      name: projectNames[index % projectNames.length],
      departmentId: dept.id,
      poc: deptPartners[0].name,
      pocDepartment: dept.id,
      techLead: deptPartners[1].name,
      techLeadDepartment: dept.id,
      budget,
      spent,
      status: "active",
      collaborators: [fortune30Partners[index % fortune30Partners.length]],
      internalPartners: deptPartners.slice(2),
      techDomainId: defaultTechDomains[index % defaultTechDomains.length].id,
      nabc: generateNABC(dept.name, projectNames[index % projectNames.length]),
      milestones: generateMilestones(`${dept.id}-project-${index + 1}`),
      metrics: generateMetrics(`${dept.id}-project-${index + 1}`, spent, budget),
      isSampleData: true
    };

    projects.push(project);
  });

  return projects;
};