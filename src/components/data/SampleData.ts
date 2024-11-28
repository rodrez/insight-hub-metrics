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

export const generateSampleProjects = async (): Promise<Project[]> => {
  try {
    const fortune30 = sampleFortune30;
    const internalPartners = await generateInternalPartners();
    return generateProjects(fortune30, internalPartners);
  } catch (error) {
    console.error('Error in sample project generation:', error);
    throw error;
  }
};