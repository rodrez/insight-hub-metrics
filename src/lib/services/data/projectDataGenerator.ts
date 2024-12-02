import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { validateProject } from '@/lib/services/sampleData/projectValidation';
import { toast } from "@/components/ui/use-toast";
import { projectNames, generateNABC } from './generators/templates/projectTemplates';
import { generateMilestones, generateMetrics } from './generators/templates/metricsTemplates';

const usedNames = new Set<string>();

const RAT_MEMBERS = [
  { id: "director", name: "Director" },
  { id: "sm1", name: "Senior Manager 1" },
  { id: "sm2", name: "Senior Manager 2" },
  { id: "sm3", name: "Senior Manager 3" },
  { id: "tl1", name: "Tech Lead 1" },
  { id: "tl2", name: "Tech Lead 2" },
  { id: "tl3", name: "Tech Lead 3" },
];

export const generateProjectData = (
  departments: Department[], 
  techDomains: TechDomain[],
  internalPartners: Collaborator[]
) => {
  const projects: Project[] = [];
  usedNames.clear();
  const fortune30Partners = generateFortune30Partners();
  
  for (let i = 0; i < 10; i++) {
    const dept = departments[i % departments.length];
    const deptPartners = internalPartners.filter(p => p.department === dept.id);
    
    if (deptPartners.length === 0) {
      toast({
        title: "Warning",
        description: `No available partners for department ${dept.id}`,
        variant: "destructive",
      });
      continue;
    }

    const pocIndex = Math.floor(Math.random() * deptPartners.length);
    const pocPartner = deptPartners[pocIndex];
    
    if (!pocPartner) {
      toast({
        title: "Warning",
        description: `No available POC partner for department ${dept.id}`,
        variant: "destructive",
      });
      continue;
    }

    usedNames.add(pocPartner.name);
    
    const availableTechLeads = internalPartners.filter(p => 
      p.department !== dept.id && !usedNames.has(p.name)
    );

    if (availableTechLeads.length === 0) {
      toast({
        title: "Warning",
        description: `No available Tech Lead for project in department ${dept.id}`,
        variant: "destructive",
      });
      continue;
    }

    const techLeadIndex = Math.floor(Math.random() * availableTechLeads.length);
    const techLeadPartner = availableTechLeads[techLeadIndex];
    usedNames.add(techLeadPartner.name);
    
    const remainingPartners = internalPartners.filter(p => 
      !usedNames.has(p.name) && 
      p.id !== pocPartner.id && 
      p.id !== techLeadPartner.id
    );

    const selectedPartners = remainingPartners
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, remainingPartners.length));

    selectedPartners.forEach(partner => usedNames.add(partner.name));

    const fortune30Index = i % fortune30Partners.length;
    const selectedFortune30 = fortune30Partners[fortune30Index];

    const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
    const spent = Math.round(budget * (0.2 + Math.random() * 0.5));

    const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];
    const ratMember = RAT_MEMBERS[i % RAT_MEMBERS.length].id;

    const project: Project = {
      id: `${dept.id}-project-${i + 1}`,
      name: projectNames[i],
      departmentId: dept.id,
      poc: pocPartner.name,
      pocDepartment: pocPartner.department,
      techLead: techLeadPartner.name,
      techLeadDepartment: techLeadPartner.department,
      ratMember,
      budget,
      spent,
      status: "active",
      collaborators: [selectedFortune30],
      internalPartners: selectedPartners,
      techDomainId: randomTechDomain.id,
      nabc: generateNABC(dept.name, projectNames[i]),
      milestones: generateMilestones(`${dept.id}-project-${i + 1}`),
      metrics: generateMetrics(`${dept.id}-project-${i + 1}`, spent, budget),
      isSampleData: true
    };

    if (validateProject(project)) {
      projects.push(project);
    } else {
      toast({
        title: "Error",
        description: `Failed to validate project for ${dept.id}`,
        variant: "destructive",
      });
    }
  }

  return { projects };
};