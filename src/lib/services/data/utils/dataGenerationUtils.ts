import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from "@/components/ui/use-toast";
import { dataQuantitiesSchema } from '@/lib/types/data';
import { Project, Collaborator } from '@/lib/types';
import { ErrorType } from '@/lib/services/error/ErrorHandlingService';

export interface GenerationProgress {
  step: string;
  progress: number;
}

export const BATCH_SIZE = 50;

export const generateId = () => {
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};

// Base validation schemas
export const collaboratorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  department: z.string().min(1),
  type: z.enum(['fortune30', 'internal', 'sme']),
  projects: z.array(z.any()).optional(),
  lastActive: z.string().datetime()
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  departmentId: z.string().min(1),
  poc: z.string().min(1),
  techLead: z.string().min(1),
  budget: z.number().min(0),
  spent: z.number().min(0),
  status: z.string()
});

export const validateDataQuantities = (
  requested: number,
  available: number,
  type: string
): number => {
  console.log(`Validating ${type} quantity - Requested: ${requested}, Available: ${available}`);
  
  // Ensure minimum quantities for essential data
  const minimumQuantities: { [key: string]: number } = {
    projects: 5,
    fortune30: 1,
    internalPartners: 2,
    smePartners: 1
  };

  const minimum = minimumQuantities[type] || 0;
  const validated = Math.max(minimum, Math.min(requested, available));

  if (validated !== requested) {
    console.warn(
      `${type} quantity adjusted from ${requested} to ${validated} ` +
      `(min: ${minimum}, max: ${available})`
    );
    toast({
      title: "Quantity Adjustment",
      description: `${type} quantity adjusted from ${requested} to ${validated}`,
      variant: "default",
    });
  } else {
    console.log(`${type} quantity validated successfully: ${validated}`);
  }

  return validated;
};

export const validateCollaborator = (collaborator: Collaborator): boolean => {
  try {
    collaboratorSchema.parse(collaborator);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast({
        title: "Validation Error",
        description: `Invalid collaborator data: ${error.errors[0].message}`,
        variant: "destructive",
      });
    }
    return false;
  }
};

export const validateProject = (project: Project): boolean => {
  try {
    projectSchema.parse(project);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast({
        title: "Validation Error",
        description: `Invalid project data: ${error.errors[0].message}`,
        variant: "destructive",
      });
    }
    return false;
  }
};

export const processInBatches = async<T>(
  items: T[],
  processFn: (batch: T[]) => Promise<void>,
  onProgress?: (progress: number) => void
) => {
  const batches = [];
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    await processFn(batches[i]);
    const progress = ((i + 1) / batches.length) * 100;
    onProgress?.(progress);
  }
};

export const generateDataWithProgress = async<T>(
  generatorFn: () => Promise<T>,
  step: string
): Promise<T> => {
  try {
    console.log(`Starting ${step}...`);
    const result = await generatorFn();
    console.log(`Completed ${step}`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${step}:`, errorMessage);
    throw error;
  }
};

export const trackGenerationProgress = (step: string, progress: number) => {
  console.log(`Progress for ${step}: ${progress}%`);
};

export const validateDataConsistency = <T extends { id: string }>(
  data: T[],
  type: string
): boolean => {
  console.log(`Validating ${type} data consistency - Count: ${data.length}`);
  const uniqueIds = new Set(data.map(item => item.id));
  const isValid = uniqueIds.size === data.length;
  
  if (!isValid) {
    console.warn(`Duplicate IDs found in ${type} data`);
    toast({
      title: "Validation Error",
      description: `Duplicate IDs found in ${type} data`,
      variant: "destructive",
    });
  } else {
    console.log(`${type} data consistency validated successfully`);
  }
  
  return isValid;
};