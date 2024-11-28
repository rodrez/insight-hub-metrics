import { db } from "@/lib/db";
import { processInBatches, BATCH_SIZE } from "@/lib/services/data/utils/dataGenerationUtils";
import { Project, Collaborator } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";

export class DatabaseOperations {
  async addCollaboratorsInBatches(collaborators: Collaborator[], onProgress?: (progress: number) => void) {
    await processInBatches(collaborators, async (batch) => {
      await Promise.all(batch.map(collaborator => db.addCollaborator(collaborator)));
    }, onProgress);
  }

  async addProjectsInBatches(projects: Project[], onProgress?: (progress: number) => void) {
    await processInBatches(projects, async (batch) => {
      await Promise.all(batch.map(project => db.addProject(project)));
    }, onProgress);
  }

  async addSPIsInBatches(spis: SPI[], onProgress?: (progress: number) => void) {
    await processInBatches(spis, async (batch) => {
      await Promise.all(batch.map(spi => db.addSPI(spi)));
    }, onProgress);
  }

  async addObjectivesInBatches(objectives: Objective[], onProgress?: (progress: number) => void) {
    await processInBatches(objectives, async (batch) => {
      await Promise.all(batch.map(objective => db.addObjective(objective)));
    }, onProgress);
  }

  async addSitRepsInBatches(sitreps: SitRep[], onProgress?: (progress: number) => void) {
    await processInBatches(sitreps, async (batch) => {
      await Promise.all(batch.map(sitrep => db.addSitRep(sitrep)));
    }, onProgress);
  }
}