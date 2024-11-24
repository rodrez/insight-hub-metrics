import { generateFortune30Partners } from '@/lib/services/data/fortune30Partners';
import { generateInternalPartners } from '@/lib/services/data/internalPartners';

export const sampleFortune30 = generateFortune30Partners();

// Initialize internal partners in an async function to handle the Promise
export const getSampleInternalPartners = async () => {
  return await generateInternalPartners();
};