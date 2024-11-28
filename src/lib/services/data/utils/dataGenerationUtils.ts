import { globalProgressTracker } from '@/lib/utils/progressTracking';

export interface GenerationProgress {
  step: string;
  progress: number;
}

export const BATCH_SIZE = 50;

export const trackGenerationProgress = (step: string, progress: number) => {
  globalProgressTracker.updateProgress(step, progress);
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
    
    // Update progress tracker
    globalProgressTracker.updateProgress("Processing", progress);
  }
};

export const validateDataQuantities = (
  requested: number,
  available: number,
  type: string
): number => {
  if (requested > available) {
    console.warn(`${type} quantity limited to ${available} (requested: ${requested})`);
    return available;
  }
  return requested;
};

export const generateDataWithProgress = async<T>(
  generatorFn: () => Promise<T>,
  step: string
): Promise<T> => {
  try {
    globalProgressTracker.addStep(step, 100);
    globalProgressTracker.updateProgress(step, 0);
    
    const result = await generatorFn();
    
    globalProgressTracker.updateProgress(step, 100);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${step}:`, errorMessage);
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
    console.warn(`Duplicate IDs found in ${type} data`);
  }
  
  return isValid;
};