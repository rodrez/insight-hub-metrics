import { z } from 'zod';
import { DataQuantities, dataQuantitiesSchema } from '@/lib/types/data';

export { dataQuantitiesSchema };

export const validateDataQuantities = (data: Partial<DataQuantities>): DataQuantities => {
  const defaultValues: DataQuantities = {
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  };

  // Merge incoming data with default values to ensure all required properties exist
  const mergedData = { ...defaultValues, ...data };

  // Validate the merged data against the schema
  const validatedData = dataQuantitiesSchema.parse(mergedData);
  
  return validatedData;
};