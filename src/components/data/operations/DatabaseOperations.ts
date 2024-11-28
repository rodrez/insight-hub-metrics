import { db } from "@/lib/db";
import { processInBatches, BATCH_SIZE } from "@/lib/services/data/utils/dataGenerationUtils";
import { Project, Collaborator } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";
import { toast } from "@/components/ui/use-toast";
import { validateProjectData, validateCollaborator } from "@/lib/utils/dataValidation";

export class DatabaseOperations {
  async addCollaboratorsInBatches(collaborators: Collaborator[], onProgress?: (progress: number) => void) {
    try {
      await processInBatches(collaborators, async (batch) => {
        const validCollaborators = batch.filter(validateCollaborator);
        await Promise.all(validCollaborators.map(collaborator => db.addCollaborator(collaborator)));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add collaborators",
        variant: "destructive",
      });
      throw error;
    }
  }

  async addProjectsInBatches(projects: Project[], onProgress?: (progress: number) => void) {
    try {
      await processInBatches(projects, async (batch) => {
        const validProjects = batch.filter(validateProjectData);
        await Promise.all(validProjects.map(project => db.addProject(project)));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add projects",
        variant: "destructive",
      });
      throw error;
    }
  }

  async addSPIsInBatches(spis: SPI[], onProgress?: (progress: number) => void) {
    try {
      await processInBatches(spis, async (batch) => {
        await Promise.all(batch.map(spi => db.addSPI(spi)));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SPIs",
        variant: "destructive",
      });
      throw error;
    }
  }

  async addObjectivesInBatches(objectives: Objective[], onProgress?: (progress: number) => void) {
    try {
      await processInBatches(objectives, async (batch) => {
        await Promise.all(batch.map(objective => db.addObjective(objective)));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add objectives",
        variant: "destructive",
      });
      throw error;
    }
  }

  async addSitRepsInBatches(sitreps: SitRep[], onProgress?: (progress: number) => void) {
    try {
      await processInBatches(sitreps, async (batch) => {
        await Promise.all(batch.map(sitrep => db.addSitRep(sitrep)));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sitreps",
        variant: "destructive",
      });
      throw error;
    }
  }
}