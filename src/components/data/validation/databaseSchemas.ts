import { z } from 'zod';
import { DataQuantities } from '@/lib/types/data';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0),
  spis: z.number().min(0),
  objectives: z.number().min(0),
  sitreps: z.number().min(0),
  fortune30: z.number().min(0),
  internalPartners: z.number().min(0),
  smePartners: z.number().min(0),
  collaborators: z.number().min(0)
});

export const validateDataQuantities = (data: Partial<DataQuantities>) => {
  const defaultValues: DataQuantities = {
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0,
    collaborators: 0
  };

  const mergedData = { ...defaultValues, ...data };
  return dataQuantitiesSchema.parse(mergedData);
};