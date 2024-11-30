import { z } from 'zod';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0),
  spis: z.number().min(0),
  objectives: z.number().min(0),
  sitreps: z.number().min(0),
  fortune30: z.number().min(0),
  internalPartners: z.number().min(0),
  smePartners: z.number().min(0)
}).required();

export type DataQuantities = z.infer<typeof dataQuantitiesSchema>;

export interface DataCounts {
  projects: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
  spis: number;
  objectives: number;
  sitreps: number;
}