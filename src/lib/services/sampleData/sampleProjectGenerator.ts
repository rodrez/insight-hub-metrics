import { Project } from '@/lib/types';
import { Collaborator } from '@/lib/types/collaboration';

const generateFallbackProject = (fortune30: Collaborator[], internalPartners: Collaborator[]): Project => ({
  id: "fallback-project-1",
  name: "Emergency Backup Project",
  departmentId: "tech",
  poc: "John Doe",
  pocDepartment: "tech",
  techLead: "Jane Smith",
  techLeadDepartment: "tech",
  budget: 100000,
  spent: 25000,
  status: "active",
  collaborators: fortune30.slice(0, 2),
  internalPartners: internalPartners.slice(0, 2),
  isSampleData: true
});

export const generateSampleProjects = async (fortune30: Collaborator[], internalPartners: Collaborator[]): Promise<Project[]> => {
  try {
    const projects = [
      {
        id: "sample-project-1",
        name: "AI Innovation Lab",
        departmentId: "techlab",
        poc: internalPartners[0]?.name || "John Doe",
        pocDepartment: "techlab",
        techLead: internalPartners[1]?.name || "Jane Smith",
        techLeadDepartment: "engineering",
        budget: 500000,
        spent: 125000,
        status: "active",
        collaborators: fortune30.slice(0, 3),
        internalPartners: internalPartners.slice(0, 3),
        isSampleData: true
      },
      {
        id: "sample-project-2",
        name: "Cloud Migration Initiative",
        departmentId: "it",
        poc: internalPartners[2]?.name || "Alice Johnson",
        pocDepartment: "it",
        techLead: internalPartners[3]?.name || "Bob Wilson",
        techLeadDepartment: "it",
        budget: 750000,
        spent: 250000,
        status: "active",
        collaborators: fortune30.slice(3, 6),
        internalPartners: internalPartners.slice(3, 6),
        isSampleData: true
      }
    ];
    
    return projects.length > 0 ? projects : [generateFallbackProject(fortune30, internalPartners)];
  } catch (error) {
    console.error('Error generating sample projects:', error);
    return [generateFallbackProject(fortune30, internalPartners)];
  }
};