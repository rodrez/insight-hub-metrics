import { z } from 'zod';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0).default(10),
  spis: z.number().min(0).default(10),
  objectives: z.number().min(0).default(5),
  sitreps: z.number().min(0).default(10),
  fortune30: z.number().min(0).default(6),
  internalPartners: z.number().min(0).default(20),
  smePartners: z.number().min(0).default(10),
  initiatives: z.number().min(0).default(5)
});

export type DataQuantities = z.infer<typeof dataQuantitiesSchema>;

export interface DataCounts extends DataQuantities {}

export interface GenerationResult<T> {
  data: T[];
  count: number;
}