import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';
import { generateSMEPartners } from '../data/smePartners';

export const generateSampleData = async (internalPartners: Collaborator[]) => {
  const departments = [...DEPARTMENTS];
  const smePartners = generateSMEPartners();
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
    smePartners,
    spis,
    objectives,
    sitreps
  };
};