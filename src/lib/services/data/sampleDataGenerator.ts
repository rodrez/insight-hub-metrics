import { Project, Department } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/constants';
import { defaultTechDomains } from '@/lib/types/techDomain';
import { generateProjectData } from './projectDataGenerator';
import { generateEmployeeData } from './employeeDataGenerator';

export const generateSampleData = () => {
  const { projects, internalEmployees } = generateProjectData(DEPARTMENTS, defaultTechDomains);
  return { projects, internalEmployees };
};