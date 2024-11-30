import { db } from "@/lib/db";
import { Project, Collaborator } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";

export class DatabaseOperations {
  async addCollaboratorsInBatches(collaborators: Collaborator[], onProgress?: () => void) {
    for (const collaborator of collaborators) {
      await db.addCollaborator(collaborator);
    }
    onProgress?.();
  }

  async addSMEPartnersInBatches(partners: Collaborator[], onProgress?: () => void) {
    for (const partner of partners) {
      await db.addSMEPartner(partner);
    }
    onProgress?.();
  }

  async addProjectsInBatches(projects: Project[], onProgress?: () => void) {
    for (const project of projects) {
      await db.addProject(project);
    }
    onProgress?.();
  }

  async addSPIsInBatches(spis: SPI[], onProgress?: () => void) {
    for (const spi of spis) {
      await db.addSPI(spi);
    }
    onProgress?.();
  }

  async addObjectivesInBatches(objectives: Objective[], onProgress?: () => void) {
    for (const objective of objectives) {
      await db.addObjective(objective);
    }
    onProgress?.();
  }

  async addSitRepsInBatches(sitreps: SitRep[], onProgress?: () => void) {
    for (const sitrep of sitreps) {
      await db.addSitRep(sitrep);
    }
    onProgress?.();
  }
}