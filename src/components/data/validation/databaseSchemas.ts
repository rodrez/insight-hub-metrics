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
});

export type ValidatedDataQuantities = z.infer<typeof dataQuantitiesSchema>;

export const validateDataQuantities = (data: DataQuantities): ValidatedDataQuantities => {
  return dataQuantitiesSchema.parse(data);
};