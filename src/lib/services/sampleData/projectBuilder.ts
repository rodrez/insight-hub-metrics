import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { assignCollaborators, clearUsedNames } from './collaboratorAssignment';
import { validateProject } from './projectValidation';
import { 
  projectNames, 
  generateNABC, 
  generateMilestones, 
  generateMetrics 
} from './projectTemplates';

export const buildProject = (
  index: number,
  dept: Department,
  techDomains: TechDomain[],
  internalPartners: Collaborator[],
  fortune30Partners: Collaborator[]
): Project | null => {
  const collaborators = assignCollaborators(dept, internalPartners, fortune30Partners);
  
  if (!collaborators) {
    return null;
  }

  const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
  const spent = Math.round(budget * (0.2 + Math.random() * 0.5)); // 20-70% spent

  // Assign a random tech domain
  const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];

  const project: Project = {
    id: `${dept.id}-project-${index + 1}`,
    name: projectNames[index],
    departmentId: dept.id,
    poc: collaborators.poc.name,
    pocDepartment: collaborators.poc.department,
    techLead: collaborators.techLead.name,
    techLeadDepartment: collaborators.techLead.department,
    budget,
    spent,
    status: "active",
    collaborators: [collaborators.fortune30Partner],
    internalPartners: collaborators.internalPartners,
    techDomainId: randomTechDomain.id,
    nabc: generateNABC(dept.name, projectNames[index]),
    milestones: generateMilestones(`${dept.id}-project-${index + 1}`),
    metrics: generateMetrics(`${dept.id}-project-${index + 1}`, spent, budget),
    isSampleData: true
  };

  if (!validateProject(project)) {
    console.error('Invalid project generated:', project);
    return null;
  }

  return project;
};