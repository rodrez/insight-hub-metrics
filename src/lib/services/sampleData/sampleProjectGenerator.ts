import { Project, Department } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';
import { Collaborator } from '@/lib/types/collaboration';
import { buildProject } from './projectBuilder';
import { clearUsedNames } from './collaboratorAssignment';

export const generateSampleProjects = async (
  fortune30: Collaborator[], 
  internalPartners: Collaborator[]
): Promise<{
  projects: Project[];
  spis: any[];
  objectives: any[];
  sitreps: any[];
}> => {
  try {
    const projects: Project[] = [];
    clearUsedNames();
    
    // Generate exactly 10 projects
    for (let i = 0; i < 10; i++) {
      const dept = DEPARTMENTS[i % DEPARTMENTS.length];
      const project = buildProject(i, dept, defaultTechDomains, internalPartners, fortune30);
      
      if (project) {
        projects.push(project);
      }
    }
    
    return { 
      projects: projects.length > 0 ? projects : [generateFallbackProject(fortune30, internalPartners)],
      spis: [],
      objectives: [],
      sitreps: []
    };
  } catch (error) {
    console.error('Error generating sample projects:', error);
    return {
      projects: [generateFallbackProject(fortune30, internalPartners)],
      spis: [],
      objectives: [],
      sitreps: []
    };
  }
};

const generateFallbackProject = (fortune30: Collaborator[], internalPartners: Collaborator[]): Project => ({
  id: "fallback-project-1",
  name: "Airplanes Innovation Project 1",
  departmentId: "airplanes",
  poc: "Rachel Lewis",
  pocDepartment: "airplanes",
  techLead: "Patricia Martinez",
  techLeadDepartment: "engineering",
  budget: 1000000,
  spent: 390000,
  status: "active",
  collaborators: fortune30.slice(0, 1),
  internalPartners: internalPartners.slice(0, 3),
  techDomainId: defaultTechDomains[0].id,
  nabc: {
    needs: "Developing next-generation airplanes systems with improved efficiency and reduced environmental impact.",
    approach: "Implementing cutting-edge technologies and innovative solutions",
    benefits: "Improved efficiency and reduced environmental impact",
    competition: "Leading the industry in sustainable aviation"
  },
  isSampleData: true
});