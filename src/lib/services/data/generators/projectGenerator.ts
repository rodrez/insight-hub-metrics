import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { DataQuantities } from '@/lib/types/data';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiGenerator';

const projectNames = [
  "Next-Gen AI Integration",
  "Sustainable Aviation",
  "Cloud Infrastructure Upgrade",
  "Quantum Computing Research",
  "Green Energy Initiative",
  "Digital Transformation",
  "Smart Manufacturing",
  "Autonomous Systems",
  "Data Analytics Platform",
  "Cybersecurity Enhancement"
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

export const generateSampleProjects = async (quantities: DataQuantities) => {
  const projects: Project[] = [];
  const departments = ['engineering', 'techlab', 'it', 'space', 'energy'];

  for (let i = 0; i < quantities.projects; i++) {
    const deptId = departments[i % departments.length];
    const budget = 1000000 * (Math.random() * 0.5 + 0.75);
    const spent = budget * (Math.random() * 0.7 + 0.1);

    const project: Project = {
      id: `${deptId}-project-${i + 1}`,
      name: projectNames[i % projectNames.length],
      departmentId: deptId,
      poc: `Sample POC ${i + 1}`,
      pocDepartment: deptId,
      techLead: `Sample Tech Lead ${i + 1}`,
      techLeadDepartment: deptId,
      budget,
      spent,
      status: "active",
      collaborators: [],
      internalPartners: [],
      techDomainId: defaultTechDomains[i % defaultTechDomains.length].id,
      nabc: generateNABC(deptId, projectNames[i % projectNames.length]),
      milestones: generateMilestones(`${deptId}-project-${i + 1}`),
      metrics: generateMetrics(`${deptId}-project-${i + 1}`, spent, budget),
      isSampleData: true
    };

    projects.push(project);
  }

  const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
  const objectives = generateSampleObjectives(quantities.objectives);
  const sitreps = generateSampleSitReps(spis, quantities.sitreps);

  return { projects, spis, objectives, sitreps };
};