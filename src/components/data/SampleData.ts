import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project } from '@/lib/types';
import { generateSampleData } from '@/lib/services/data/sampleDataGenerator';

export const sampleFortune30 = generateFortune30Partners();

// Initialize internal partners in an async function to handle the Promise
export const getSampleInternalPartners = async () => {
  return await generateInternalPartners();
};

// Generate sample projects with the collaborators
export const generateSampleProjects = async (): Promise<Project[]> => {
  const { projects } = await generateSampleData([]);
  return projects;
};