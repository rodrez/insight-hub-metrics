import { z } from 'zod';
import { DataQuantities } from '../types/dataTypes';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0),
  spis: z.number().min(0),
  objectives: z.number().min(0),
  sitreps: z.number().min(0),
  fortune30: z.number().min(0),
  internalPartners: z.number().min(0),
  smePartners: z.number().min(0)
}).required();

export const validateDataQuantities = (data: Partial<DataQuantities>): DataQuantities => {
  // Create a complete object with default values
  const completeData: DataQuantities = {
    projects: data.projects ?? 0,
    spis: data.spis ?? 0,
    objectives: data.objectives ?? 0,
    sitreps: data.sitreps ?? 0,
    fortune30: data.fortune30 ?? 0,
    internalPartners: data.internalPartners ?? 0,
    smePartners: data.smePartners ?? 0
  };

  // Validate the complete data object
  return dataQuantitiesSchema.parse(completeData);
};