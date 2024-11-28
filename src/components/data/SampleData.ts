import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';
import { Project } from '@/lib/types';
import { generateSampleProjects as generateProjects } from '@/lib/services/sampleData/sampleProjectGenerator';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';

export const sampleFortune30 = generateFortune30Partners();

export const getSampleInternalPartners = async () => {
  const internalPartners = await generateInternalPartners();
  return internalPartners;
};

export const generateSampleProjects = async (): Promise<{
  projects: Project[];
  spis: any[];
  objectives: any[];
  sitreps: any[];
}> => {
  try {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    
    // Generate projects
    const result = await generateProjects(fortune30, internalPartners);
    const projects = result.projects;
    
    // Generate exactly 10 SPIs
    const spis = generateSampleSPIs(projects.map(p => p.id));
    
    // Generate exactly 5 objectives
    const objectives = generateSampleObjectives();
    
    // Generate exactly 10 sitreps
    const sitreps = generateSampleSitReps(spis);

    return { projects, spis, objectives, sitreps };
  } catch (error) {
    console.error('Error in sample data generation:', error);
    throw error;
  }
};