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
    onProgress?.((i + 1) / batches.length * 100);
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

export const generateDataWithProgress = async (
  generatorFn: () => Promise<any>,
  step: string
): Promise<any> => {
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