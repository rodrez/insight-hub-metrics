import { toast } from "@/components/ui/use-toast";
import { Project, Collaborator } from '@/lib/types';
import { SPI } from '@/lib/types/spi';
import { Objective } from '@/lib/types/objective';
import { SitRep } from '@/lib/types/sitrep';

export interface GenerationProgress {
  step: string;
  progress: number;
}

export const BATCH_SIZE = 50;

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
    
    // Update UI with progress
    if (i % 2 === 0) { // Update every other batch to avoid too many toasts
      trackGenerationProgress("Processing", progress);
    }
  }
};

export const trackGenerationProgress = (step: string, progress: number) => {
  toast({
    title: "Generating Data",
    description: `${step}: ${Math.round(progress)}%`,
  });
};

export const validateDataQuantities = (
  requested: number,
  available: number,
  type: string
): number => {
  if (requested > available) {
    toast({
      title: "Notice",
      description: `${type} quantity limited to ${available} (requested: ${requested})`,
      variant: "default",
    });
    return available;
  }
  return requested;
};

export const generateDataWithProgress = async<T>(
  generatorFn: () => Promise<T>,
  step: string
): Promise<T> => {
  try {
    trackGenerationProgress(step, 0);
    const result = await generatorFn();
    trackGenerationProgress(step, 100);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${step}:`, errorMessage);
    toast({
      title: "Error",
      description: `Failed to generate ${step}: ${errorMessage}`,
      variant: "destructive",
    });
    throw error;
  }
};

export const validateDataConsistency = <T extends { id: string }>(
  data: T[],
  type: string
): boolean => {
  const uniqueIds = new Set(data.map(item => item.id));
  const isValid = uniqueIds.size === data.length;
  
  if (!isValid) {
    toast({
      title: "Validation Error",
      description: `Duplicate IDs found in ${type} data`,
      variant: "destructive",
    });
  }
  
  return isValid;
};