import { z } from 'zod';
import { DataQuantities, dataQuantitiesSchema } from '@/lib/types/data';

export { dataQuantitiesSchema };

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