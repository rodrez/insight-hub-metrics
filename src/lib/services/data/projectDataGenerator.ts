import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { validateProject } from '@/lib/services/sampleData/projectValidation';
import { toast } from "@/components/ui/use-toast";
import { projectNames, generateNABC } from './generators/templates/projectTemplates';
import { generateMilestones, generateMetrics } from './generators/templates/metricsTemplates';

export const generateProjectData = (
  departments: Department[], 
  techDomains: TechDomain[],
  internalPartners: Collaborator[],
  requestedCount: number = 10
) => {
  console.log(`Generating ${requestedCount} projects...`);
  const projects: Project[] = [];
  const usedNames = new Set<string>();
  const fortune30Partners = generateFortune30Partners();
  
  // Generate exactly the requested number of projects
  for (let i = 0; i < requestedCount; i++) {
    const dept = departments[i % departments.length];
    const deptPartners = internalPartners.filter(p => p.department === dept.id);
    
    if (deptPartners.length === 0) {
      console.warn(`No available partners for department ${dept.id}`);
      continue;
    }

    const pocIndex = Math.floor(Math.random() * deptPartners.length);
    const pocPartner = deptPartners[pocIndex];
    
    if (!pocPartner) {
      console.warn(`No available POC partner for department ${dept.id}`);
      continue;
    }

    const availableTechLeads = internalPartners.filter(p => 
      p.department !== dept.id && !usedNames.has(p.name)
    );

    if (availableTechLeads.length === 0) {
      console.warn(`No available Tech Lead for project in department ${dept.id}`);
      continue;
    }

    const techLeadIndex = Math.floor(Math.random() * availableTechLeads.length);
    const techLeadPartner = availableTechLeads[techLeadIndex];
    
    const fortune30Index = i % fortune30Partners.length;
    const selectedFortune30 = fortune30Partners[fortune30Index];

    const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
    const spent = Math.round(budget * (0.2 + Math.random() * 0.5));

    const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];

    const project: Project = {
      id: `${dept.id}-project-${i + 1}`,
      name: projectNames[i % projectNames.length],
      departmentId: dept.id,
      poc: pocPartner.name,
      pocDepartment: pocPartner.department,
      techLead: techLeadPartner.name,
      techLeadDepartment: techLeadPartner.department,
      budget,
      spent,
      status: "active",
      collaborators: [selectedFortune30],
      internalPartners: [pocPartner, techLeadPartner],
      techDomainId: randomTechDomain.id,
      nabc: generateNABC(dept.name, projectNames[i % projectNames.length]),
      milestones: generateMilestones(`${dept.id}-project-${i + 1}`),
      metrics: generateMetrics(`${dept.id}-project-${i + 1}`, spent, budget),
      isSampleData: true
    };

    if (validateProject(project)) {
      projects.push(project);
      console.log(`Generated project ${i + 1}/${requestedCount}`);
    } else {
      console.error(`Failed to validate project for ${dept.id}`);
    }
  }

  console.log(`Successfully generated ${projects.length} projects`);
  return { projects };
};