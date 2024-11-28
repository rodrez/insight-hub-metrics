import { Project, Department } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';

export const generateSampleData = async (internalPartners: Collaborator[]) => {
  const departments = [...DEPARTMENTS];
  const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners);
  
  // Generate SPIs first
  const spis = generateSampleSPIs();
  
  // Generate objectives that reference the SPIs
  const objectives = generateSampleObjectives();
  
  // Generate sitreps that reference the SPIs
  const sitreps = generateSampleSitReps(spis);
  
  return { 
    projects, 
    internalPartners,
    spis,
    objectives,
    sitreps
  };
};