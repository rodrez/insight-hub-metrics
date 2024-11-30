import { z } from 'zod';

export interface DataQuantities {
  projects: number;
  collaborators: number;
  spis: number;
  sitreps: number;
}

export const dataQuantitiesSchema = z.object({
  projects: z.number().min(0),
  collaborators: z.number().min(0),
  spis: z.number().min(0),
  sitreps: z.number().min(0)
});