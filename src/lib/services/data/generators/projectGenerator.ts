import { Project } from '@/lib/types';
import { Department } from '@/lib/types';
import { Collaborator } from '@/lib/types/collaboration';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { DataQuantities } from '@/lib/types/data';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiGenerator';
import { generateNABC } from './templates/projectTemplates';
import { generateMilestones, generateMetrics } from './templates/metricsTemplates';

interface ProjectGenerationConfig extends Omit<DataQuantities, 'internalPartners' | 'fortune30' | 'smePartners'> {
  departments: Department[];
  fortune30Partners: Collaborator[];
  internalPartners: Collaborator[];
  smePartners: Collaborator[];
}

const generateBasicProject = (
  index: number,
  dept: Department,
  fortune30Partner: Collaborator,
  internalPartner: Collaborator,
  techLead: Collaborator
): Project => {
  const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
  const spent = Math.round(budget * (0.2 + Math.random() * 0.5));

  return {
    id: `${dept.id}-project-${index + 1}`,
    name: `Project ${index + 1}`,
    departmentId: dept.id,
    poc: internalPartner.name,
    pocDepartment: internalPartner.department,
    techLead: techLead.name,
    techLeadDepartment: techLead.department,
    budget,
    spent,
    status: "active",
    collaborators: [fortune30Partner],
    internalPartners: [internalPartner],
    techDomainId: defaultTechDomains[0].id,
    nabc: generateNABC(dept.name, `Project ${index + 1}`),
    milestones: generateMilestones(`${dept.id}-project-${index + 1}`),
    metrics: generateMetrics(`${dept.id}-project-${index + 1}`, spent, budget),
    isSampleData: true
  };
};

export const generateSampleProjects = async (input: ProjectGenerationConfig) => {
  const projects: Project[] = [];

  // Generate requested number of projects
  for (let i = 0; i < input.projects; i++) {
    const dept = input.departments[i % input.departments.length];
    const fortune30Partner = input.fortune30Partners[i % input.fortune30Partners.length];
    const availableInternals = input.internalPartners.filter(p => !projects.some(proj => 
      proj.poc === p.name || proj.techLead === p.name
    ));

    if (availableInternals.length < 2) continue;

    const poc = availableInternals[0];
    const techLead = availableInternals[1];

    const project = generateBasicProject(i, dept, fortune30Partner, poc, techLead);
    projects.push(project);
  }

  const spis = generateSampleSPIs(projects.map(p => p.id), input.spis);
  const objectives = generateSampleObjectives(input.objectives);
  const sitreps = generateSampleSitReps(spis, input.sitreps);

  return { projects, spis, objectives, sitreps };
};