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
    const projects = generateProjects(fortune30, internalPartners);
    
    // Generate SPIs first, passing project IDs for linking
    const spis = generateSampleSPIs(projects.map(p => p.id));
    
    // Generate objectives that reference the SPIs
    const objectives = generateSampleObjectives();
    
    // Generate sitreps that reference the SPIs and inherit project links
    const sitreps = generateSampleSitReps(spis);

    return { projects, spis, objectives, sitreps };
  } catch (error) {
    console.error('Error in sample data generation:', error);
    throw error;
  }
};