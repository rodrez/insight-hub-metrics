import { SPI } from '@/lib/types/spi';
import { SitRep } from '@/lib/types/sitrep';
import { addDays } from 'date-fns';

export const generateSampleSPIs = (projectIds: string[], count: number): SPI[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `spi-${i + 1}`,
    name: `Strategic Initiative ${i + 1}`,
    deliverable: `Deliverable for Initiative ${i + 1}`,
    details: `Details for Initiative ${i + 1}`,
    expectedCompletionDate: addDays(new Date(), 30).toISOString(),
    status: 'on-track',
    projectId: projectIds[i % projectIds.length],
    departmentId: 'engineering',
    sitrepIds: [],
    createdAt: new Date().toISOString(),
    ratMember: `RAT Member ${i + 1}`
  }));
};

export const generateSampleSitReps = (spis: SPI[], count: number): SitRep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sitrep-${i + 1}`,
    title: `SitRep ${i + 1}`,
    date: new Date().toISOString(),
    spiId: spis[i % spis.length].id,
    update: `Update for SitRep ${i + 1}`,
    challenges: `Challenges for SitRep ${i + 1}`,
    nextSteps: `Next steps for SitRep ${i + 1}`,
    status: 'pending-review',
    level: 'SVP',
    summary: `Summary for SitRep ${i + 1}`,
    departmentId: 'engineering',
    ratMember: `RAT Member ${i + 1}`
  }));
};