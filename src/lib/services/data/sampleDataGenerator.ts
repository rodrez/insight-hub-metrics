import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/sampleData/spiData';
import { DataQuantities } from '@/components/data/SampleData';

export const generateSampleData = async (internalPartners: Collaborator[], quantities: DataQuantities) => {
  const departments = [...DEPARTMENTS];
  const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners);
  
  // Generate SPIs first, passing project IDs for linking some SPIs to projects
  const spis = generateSampleSPIs(projects.map(p => p.id), quantities.spis);
  
  // Generate objectives that reference the SPIs
  const objectives = generateSampleObjectives(quantities.objectives);
  
  // Generate sitreps that reference the SPIs and inherit project links
  const sitreps = generateSampleSitReps(spis, quantities.sitreps);
  
  return { 
    projects, 
    internalPartners,
    spis,
    objectives,
    sitreps
  };
};