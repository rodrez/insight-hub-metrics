import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project } from '@/lib/types';
import { generateSampleData } from '@/lib/services/data/sampleDataGenerator';

export const sampleFortune30 = generateFortune30Partners();

// Initialize internal partners in an async function to handle the Promise
export const getSampleInternalPartners = async () => {
  const fortune30 = sampleFortune30;
  const internalPartners = await generateInternalPartners();
  return internalPartners;
};

// Generate sample projects with the collaborators
export const generateSampleProjects = async (): Promise<Project[]> => {
  try {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    const { projects } = await generateSampleData([...fortune30, ...internalPartners]);
    
    if (!projects || projects.length === 0) {
      console.error('No projects were generated');
      // Fallback to basic project if generation fails
      return [{
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
      }];
    }
    
    return projects;
  } catch (error) {
    console.error('Error generating sample projects:', error);
    throw error;
  }
};