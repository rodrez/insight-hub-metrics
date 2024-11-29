import { db } from "@/lib/db";
import { processInBatches } from "@/lib/services/data/utils/dataGenerationUtils";
import { Project, Collaborator } from "@/lib/types";
import { SPI } from "@/lib/types/spi";
import { Objective } from "@/lib/types/objective";
import { SitRep } from "@/lib/types/sitrep";
import { toast } from "@/components/ui/use-toast";
import { validateProjectData, validateCollaborator } from "@/lib/utils/dataValidation";

type EntityType = 'collaborators' | 'projects' | 'spis' | 'objectives' | 'sitreps';

export class DatabaseOperations {
  private async addEntitiesInBatches<T>(
    entities: T[],
    entityType: EntityType,
    addFunction: (entity: T) => Promise<void>,
    validateFunction?: (entity: T) => boolean,
    onProgress?: (progress: number) => void
  ) {
    try {
      await processInBatches(entities, async (batch) => {
        const validEntities = validateFunction 
          ? batch.filter(validateFunction)
          : batch;
        await Promise.all(validEntities.map(addFunction));
      }, onProgress);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add ${entityType}`,
        variant: "destructive",
      });
      throw error;
    }
  }

  async addCollaboratorsInBatches(collaborators: Collaborator[], onProgress?: (progress: number) => void) {
    await this.addEntitiesInBatches(
      collaborators,
      'collaborators',
      (collaborator) => db.addCollaborator(collaborator),
      validateCollaborator,
      onProgress
    );
  }

  async addProjectsInBatches(projects: Project[], onProgress?: (progress: number) => void) {
    await this.addEntitiesInBatches(
      projects,
      'projects',
      (project) => db.addProject(project),
      validateProjectData,
      onProgress
    );
  }

  async addSPIsInBatches(spis: SPI[], onProgress?: (progress: number) => void) {
    await this.addEntitiesInBatches(
      spis,
      'spis',
      (spi) => db.addSPI(spi),
      undefined,
      onProgress
    );
  }

  async addObjectivesInBatches(objectives: Objective[], onProgress?: (progress: number) => void) {
    await this.addEntitiesInBatches(
      objectives,
      'objectives',
      (objective) => db.addObjective(objective),
      undefined,
      onProgress
    );
  }

  async addSitRepsInBatches(sitreps: SitRep[], onProgress?: (progress: number) => void) {
    await this.addEntitiesInBatches(
      sitreps,
      'sitreps',
      (sitrep) => db.addSitRep(sitrep),
      undefined,
      onProgress
    );
  }
}