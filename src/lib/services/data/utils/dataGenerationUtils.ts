import { useQueryClient } from '@tanstack/react-query';

export interface GenerationProgress {
  step: string;
  progress: number;
}

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
  step: string,
  queryKey?: string[]
): Promise<T> => {
  const queryClient = useQueryClient();
  
  try {
    if (queryKey) {
      queryClient.setQueryData(queryKey, { step, progress: 0 });
    }
    
    const result = await generatorFn();
    
    if (queryKey) {
      queryClient.setQueryData(queryKey, { step, progress: 100 });
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${step}:`, errorMessage);
    throw error;
  }
};

export const trackGenerationProgress = (step: string, progress: number) => {
  const queryClient = useQueryClient();
  queryClient.setQueryData(['generation-progress'], { step, progress });
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