import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from '../data/projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';

export const generateSampleData = async (internalPartners: Collaborator[]) => {
  const departments = [...DEPARTMENTS];
  const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners);
  
  // Generate SPIs first, passing project IDs for linking some SPIs to projects
  const spis = generateSampleSPIs(projects.map(p => p.id));
  
  // Generate objectives that reference the SPIs
  const objectives = generateSampleObjectives();
  
  // Generate sitreps that reference the SPIs and inherit project links
  const sitreps = generateSampleSitReps(spis);
  
  return { 
    projects, 
    internalPartners,
    spis,
    objectives,
    sitreps,
    smePartners: [] // Add empty array for SME partners
  };
};