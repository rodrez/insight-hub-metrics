import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { validateProject } from '@/lib/services/sampleData/projectValidation';
import { toast } from "@/components/ui/use-toast";

// Track used names across all projects
const usedNames = new Set<string>();

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
  approach: "Implementing cutting-edge technologies and innovative solutions, combined with AI-driven optimization algorithms for maximum performance.",
  benefits: "20% reduction in operational costs, 15% decrease in maintenance costs, and potential market leadership in eco-friendly solutions.",
  competition: "Major competitors are investing in similar technologies, but our integrated approach provides a significant advantage in time-to-market."
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
    title: "Design Phase",
    description: "Complete system architecture and detailed design",
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-progress" as const,
    progress: 65
  },
  {
    id: `${projectId}-m3`,
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

export const generateProjectData = (
  departments: Department[], 
  techDomains: TechDomain[],
  internalPartners: Collaborator[]
) => {
  const projects: Project[] = [];
  usedNames.clear();
  const fortune30Partners = generateFortune30Partners();
  
  // Ensure we create exactly 10 projects spread across departments
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

    // Select POC from current department's partners
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

    // Only add to usedNames if we're actually using this name
    usedNames.add(pocPartner.name);
    
    // Select Tech Lead from partners not in usedNames and not from same department
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
    
    // Select random internal partners
    const remainingPartners = internalPartners.filter(p => 
      !usedNames.has(p.name) && 
      p.id !== pocPartner.id && 
      p.id !== techLeadPartner.id
    );

    const selectedPartners = remainingPartners
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, remainingPartners.length));

    selectedPartners.forEach(partner => usedNames.add(partner.name));

    // Ensure at least one Fortune 30 partner
    const fortune30Index = i % fortune30Partners.length;
    const selectedFortune30 = fortune30Partners[fortune30Index];

    const budget = Math.round((dept.budget / dept.projectCount) * (0.8 + Math.random() * 0.4));
    const spent = Math.round(budget * (0.2 + Math.random() * 0.5)); // 20-70% spent

    // Assign a random tech domain
    const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];

    const project: Project = {
      id: `${dept.id}-project-${i + 1}`,
      name: projectNames[i],
      departmentId: dept.id,
      poc: pocPartner.name,
      pocDepartment: pocPartner.department,
      techLead: techLeadPartner.name,
      techLeadDepartment: techLeadPartner.department,
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