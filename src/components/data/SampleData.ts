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

export const generateSampleProjects = async (quantities: {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
}): Promise<{
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
    
    // Generate SPIs based on quantity setting
    const spis = generateSampleSPIs(projects.map(p => p.id)).slice(0, quantities.spis);
    
    // Generate objectives based on quantity setting
    const objectives = generateSampleObjectives().slice(0, quantities.objectives);
    
    // Generate sitreps based on quantity setting
    const sitreps = generateSampleSitReps(spis).slice(0, quantities.sitreps);

    return { projects, spis, objectives, sitreps };
  } catch (error) {
    console.error('Error in sample data generation:', error);
    throw error;
  }
};