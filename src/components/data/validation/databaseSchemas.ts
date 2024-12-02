import { z } from 'zod';

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0).default(5),
  spis: z.number().min(0).default(10),
  objectives: z.number().min(0).default(5),
  sitreps: z.number().min(0).default(10),
  fortune30: z.number().min(0).default(6),
  internalPartners: z.number().min(0).default(20),
  smePartners: z.number().min(0).default(5),
  initiatives: z.number().min(0).default(5)
});