import { z } from "zod";
import { DataQuantities } from "../SampleData";

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0).max(100),
  spis: z.number().min(0).max(200),
  objectives: z.number().min(0).max(100),
  sitreps: z.number().min(0).max(200),
  fortune30: z.number().min(0).max(6),
  internalPartners: z.number().min(0).max(50),
  smePartners: z.number().min(0).max(50)
}).required();

export type ValidatedDataQuantities = z.infer<typeof dataQuantitiesSchema>;

const defaultValues: Required<DataQuantities> = {
  projects: 5,
  spis: 10,
  objectives: 5,
  sitreps: 10,
  fortune30: 6,
  internalPartners: 20,
  smePartners: 5
};

export const validateDataQuantities = (data: Partial<DataQuantities>): DataQuantities => {
  // Create a complete DataQuantities object by merging with defaults
  const completeData: Required<DataQuantities> = {
    ...defaultValues,
    ...data
  };
  
  return dataQuantitiesSchema.parse(completeData);
};