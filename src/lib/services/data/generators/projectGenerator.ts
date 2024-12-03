import { Project, Department } from '@/lib/types';
import { Collaborator } from '@/lib/types/collaboration';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateNABC } from './templates/projectTemplates';
import { generateMilestones, generateMetrics } from './templates/metricsTemplates';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from './spiGenerator';
import { getRandomRatMember } from '../utils/ratMemberUtils';

export interface ProjectGenerationInput {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
  departments: Department[];
  fortune30Partners: Collaborator[];
  collaborators: Collaborator[];
}

const projectTypes = [
  {
    name: "Digital Transformation",
    template: "Enterprise-wide digital transformation initiative focusing on modernization and efficiency",
    objectives: ["Modernize legacy systems", "Improve operational efficiency", "Enable digital capabilities"]
  },
  {
    name: "Innovation Lab",
    template: "Research and development project exploring cutting-edge technologies",
    objectives: ["Explore emerging technologies", "Develop proof of concepts", "Create innovation roadmap"]
  },
  {
    name: "Cloud Migration",
    template: "Strategic migration of core systems to cloud infrastructure",
    objectives: ["Reduce infrastructure costs", "Improve scalability", "Enhance security"]
  },
  {
    name: "Data Analytics Platform",
    template: "Advanced analytics platform for business intelligence and insights",
    objectives: ["Centralize data sources", "Enable real-time analytics", "Improve decision making"]
  },
  {
    name: "Security Enhancement",
    template: "Comprehensive security upgrade across systems and networks",
    objectives: ["Strengthen security posture", "Implement zero trust", "Enhance monitoring"]
  }
];

const generateBasicProject = (
  index: number,
  dept: Department,
  fortune30Partner: Collaborator,
  internalPartner: Collaborator,
  techLead: Collaborator
): Project => {
  const projectType = projectTypes[index % projectTypes.length];
  const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
  const spent = Math.round(budget * (0.2 + Math.random() * 0.5));
  const today = new Date();

  return {
    id: `${dept.id}-project-${index + 1}`,
    name: `${dept.name} ${projectType.name}`,
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
    techDomainId: defaultTechDomains[index % defaultTechDomains.length].id,
    nabc: generateNABC(dept.name, projectType.name),
    milestones: generateMilestones(`${dept.id}-project-${index + 1}`),
    metrics: generateMetrics(`${dept.id}-project-${index + 1}`, spent, budget),
    isSampleData: true,
    ratMember: getRandomRatMember()
  };
};

export const generateSampleProjects = async (input: ProjectGenerationInput) => {
  const projects: Project[] = [];
  const usedPartners = new Set<string>();

  const getAvailableInternals = () => {
    const availableInternals = input.collaborators.filter(p => !usedPartners.has(p.name));
    if (availableInternals.length < 2) {
      // Reset the used partners pool if we need more partners
      usedPartners.clear();
      return input.collaborators;
    }
    return availableInternals;
  };

  for (let i = 0; i < input.projects; i++) {
    const dept = input.departments[i % input.departments.length];
    const fortune30Partner = input.fortune30Partners[i % input.fortune30Partners.length];
    
    const availableInternals = getAvailableInternals();
    const poc = availableInternals[0];
    const techLead = availableInternals[1];

    if (poc && techLead) {
      usedPartners.add(poc.name);
      usedPartners.add(techLead.name);

      const project = generateBasicProject(i, dept, fortune30Partner, poc, techLead);
      projects.push(project);
    }
  }

  const spis = generateSampleSPIs(projects.map(p => p.id), input.spis);
  const objectives = generateSampleObjectives(input.objectives);
  const sitreps = generateSampleSitReps(spis, input.sitreps);

  return { projects, spis, objectives, sitreps };
};
