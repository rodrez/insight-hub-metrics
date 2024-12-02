import { SPI } from "@/lib/types/spi";
import { SitRep } from "@/lib/types/sitrep";
import { Objective } from "@/lib/types/objective";
import { generateId } from "../utils/dataGenerationUtils";

export const generateSampleSPIs = (projectIds: string[], count: number): SPI[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    name: `SPI ${i + 1}`,
    deliverable: `Deliverable ${i + 1}`,
    details: `Details for SPI ${i + 1}`,
    expectedCompletionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "on-track",
    projectId: projectIds[i % projectIds.length],
    departmentId: "default",
    sitrepIds: [],
    createdAt: new Date().toISOString(),
    ratMember: `RAT Member ${i + 1}`
  }));
};

export const generateSampleObjectives = (count: number): Objective[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    title: `Objective ${i + 1}`,
    description: `Description for objective ${i + 1}`,
    initiative: `Initiative ${i + 1}`,
    desiredOutcome: "0%",
    spiIds: [],
    ratMember: `RAT Member ${i + 1}`
  }));
};

export const generateSampleSitReps = (spis: SPI[], count: number): SitRep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    title: `SitRep ${i + 1}`,
    date: new Date().toISOString(),
    spiId: spis[i % spis.length].id,
    update: `Update ${i + 1}`,
    challenges: `Challenges ${i + 1}`,
    nextSteps: `Next steps ${i + 1}`,
    status: "pending-review",
    level: "CEO",
    summary: `Summary ${i + 1}`,
    departmentId: "default",
    ratMember: `RAT Member ${i + 1}`
  }));
};