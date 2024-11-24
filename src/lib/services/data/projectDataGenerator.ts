import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';

// Track used names across all projects
const usedNames = new Set<string>();

export const generateProjectData = (
  departments: Department[], 
  techDomains: TechDomain[],
  internalPartners: Collaborator[]
) => {
  const projects: Project[] = [];
  usedNames.clear(); // Clear the set before generating new projects
  const fortune30Partners = generateFortune30Partners();
  
  departments.forEach((dept, deptIndex) => {
    const projectCount = dept.projectCount;
    const deptPartners = internalPartners.filter(p => p.department === dept.id);
    
    for (let i = 0; i < projectCount; i++) {
      // Create a pool of available partners excluding POC and Tech Lead
      const availablePartners = [...deptPartners];
      
      // Select POC from current department's partners
      const pocIndex = Math.floor(Math.random() * availablePartners.length);
      const pocPartner = availablePartners[pocIndex];
      
      if (!pocPartner) {
        console.warn(`No available POC partner for department ${dept.id}`);
        continue;
      }

      // Add POC to used names
      usedNames.add(pocPartner.name);
      availablePartners.splice(pocIndex, 1); // Remove POC from available pool
      
      // Select Tech Lead from partners not in usedNames
      const availableTechLeads = internalPartners.filter(p => 
        p.department !== dept.id && !usedNames.has(p.name)
      );

      if (availableTechLeads.length === 0) {
        console.warn(`No available Tech Lead for project in department ${dept.id}`);
        continue;
      }

      const techLeadIndex = Math.floor(Math.random() * availableTechLeads.length);
      const techLeadPartner = availableTechLeads[techLeadIndex];
      usedNames.add(techLeadPartner.name);
      
      // Select random internal partners from remaining pool who aren't already used
      const remainingPartners = internalPartners.filter(p => 
        !usedNames.has(p.name) && 
        p.id !== pocPartner.id && 
        p.id !== techLeadPartner.id
      );

      const selectedPartners = remainingPartners
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, remainingPartners.length));

      // Add selected partners to used names
      selectedPartners.forEach(partner => usedNames.add(partner.name));

      // Ensure at least one Fortune 30 partner by rotating through them
      const fortune30Index = (deptIndex + i) % fortune30Partners.length;
      const selectedFortune30 = fortune30Partners[fortune30Index];

      const budget = Math.round(dept.budget / projectCount);
      const spent = Math.round(budget * (Math.random() * 0.8));

      // Assign a random tech domain
      const randomTechDomain = techDomains[Math.floor(Math.random() * techDomains.length)];

      const project: Project = {
        id: `${dept.id}-project-${i + 1}`,
        name: `${dept.name} Innovation Project ${i + 1}`,
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
        nabc: generateNABC(dept.name),
        milestones: generateMilestones(`${dept.id}-project-${i + 1}`),
        metrics: generateMetrics(`${dept.id}-project-${i + 1}`, spent, budget),
        isSampleData: true
      };

      projects.push(project);
    }
  });

  return { projects };
};

const generateNABC = (deptName: string) => ({
  needs: `Developing next-generation ${deptName.toLowerCase()} systems with improved efficiency and reduced environmental impact.`,
  approach: "Implementing advanced technologies and innovative solutions, combined with AI-driven optimization algorithms for maximum performance.",
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
