import { Project, Department } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { Collaborator } from '@/lib/types/collaboration';

export const generateSampleData = (internalPartners: Collaborator[]) => {
  const departments = [...DEPARTMENTS]; // Create mutable copy
  const { projects } = generateProjectData(departments, defaultTechDomains, internalPartners);
  return { projects, internalPartners };
};