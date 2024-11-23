import { Project, Department } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { generateInternalPartners } from './internalPartners';

export const generateSampleData = () => {
  const departments = [...DEPARTMENTS]; // Create mutable copy
  const internalPartners = generateInternalPartners();
  const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners);
  return { projects, internalPartners };
};