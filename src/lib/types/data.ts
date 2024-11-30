import { z } from 'zod';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0).default(10),
  spis: z.number().min(0).default(10),
  objectives: z.number().min(0).default(5),
  sitreps: z.number().min(0).default(10),
  fortune30: z.number().min(0).default(6),
  internalPartners: z.number().min(0).default(20),
  smePartners: z.number().min(0).default(10)
});

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

export interface GenerationResult<T> {
  data: T[];
  count: number;
}